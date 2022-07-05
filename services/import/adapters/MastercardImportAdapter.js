import moment from "moment";
import {getFeeInfo, getNumber} from "./utils"
import ImportAdapter from "~/services/import/ImportAdapter";
export default class MastercardImportAdapter extends ImportAdapter {
  previousBalanceArs = 0
  processMonthDetails = false
  finalConcepts = [
    'INTERESES COMPENSATORIOS',
    'IMPUESTO DE SELLOS',
    'I.V.A. 21,0%'
  ]

  canImport(lines) {
    for (const line of lines) {
      if (line === 'MASTERCARD PLATINUM') {
        this.account.id = 'GALICIA-MASTERCARD-PLATINUM'
        this.account.title = 'Galicia (Mastercard Platinum)'
        return true
      }
    }
    return false
  }

  import(line) {
    const parts = line.split(' ')
    let lastIndex = parts.length - 1
    if (parts.slice(0, 2).join(' ') === 'PAGO MINIMO') {
      this.setPeriodMinArs(parts[2])
      return
    }
    if (parts.slice(0, 4).join(' ') === 'Estado de Cuenta al:') {
      this.setPeriod(parts[4])
      return
    }
    if (parts.slice(0, 2).join(' ') === 'SALDO PENDIENTE') {
      this.previousBalanceArs = getNumber(parts[2])
      return
    }
    for (const concept of this.finalConcepts) {
      if (line.startsWith(concept)) {
        this.pushItem(
          parts.slice(0, lastIndex).join(' '),
          this.period,
          getNumber(parts[lastIndex]),
          1,
          1
        )
        return
      }
    }
    if (line === 'DETALLES DEL MES') {
      this.processMonthDetails = true
    }
    if (line.includes('Debitaremos de su c.ahorro')) {
      this.processMonthDetails = false
    }
    if (!this.processMonthDetails) {
      return
    }
    let dateFormat = null
    if (parts[0].match(/\d{2}-[A-Za-z]{3}-\d{2}/) !== null) {
      dateFormat = 'DD-MMM-YY'
    }
    if (dateFormat !== null) {
      while (lastIndex >= 0 && isNaN(getNumber(parts[lastIndex]))) {
        lastIndex--
      }
      if (lastIndex < 0) {
        return
      }
      const feeInfo = getFeeInfo(parts)
      this.pushItem(
        parts.slice(1, lastIndex).join(' '),
        moment(parts[0], dateFormat).toDate(),
        getNumber(parts[lastIndex]),
        feeInfo.feeNumber,
        feeInfo.totalFees
      )
    }
  }

  afterImport(lines) {
    this.unshiftItem(
      'Balance anterior',
      this.period.date,
      parseFloat(this.previousBalanceArs.toFixed(2)),
      1,
      1
    )
  }
}
