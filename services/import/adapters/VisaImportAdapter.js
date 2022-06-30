import moment from "moment";
import {getDate, getFeeInfo, getNumber} from "./utils"
import ImportAdapter from "~/services/import/ImportAdapter";
export default class VisaImportAdapter extends ImportAdapter {
  account = {id: 'VISA', title: 'VISA', color: 'primary'}
  previousBalanceArs = 0

  canImport(lines) {
    for (const line of lines) {
      if (line.includes('Galicia Visa Platinum')) {
        this.account.id = 'Galicia-Visa-Platinum'
        this.account.title = 'Galicia Visa Platinum'
        return true
      }
      if (line.includes('BANCO ENTRE RIOS')) {
        this.account.id = 'BANCO-ENTRE-RIOS'
        this.account.title = 'BERSA'
        return true
      }
    }
    return false
  }

  import(line) {
    const parts = line.split(' ')
    let lastIndex = parts.length - 1
    if (line.includes('CIERRE ACTUAL: ') && !this.period) {
      const strDate = line.substr(line.lastIndexOf('CIERRE ACTUAL: ') + 'CIERRE ACTUAL: '.length)
      this.period = getDate(strDate).toDate()
      return
    }
    if (parts.slice(0, 2).join(' ') === 'SALDO ANTERIOR') {
      this.previousBalanceArs += getNumber(parts[2])
      return
    }
    if (parts.slice(1, 5).join(' ') === 'SU PAGO EN PESOS') {
      this.previousBalanceArs -= getNumber(parts[5])
      return
    }
    if (parts.slice(1, 4).join(' ') === 'CR.$ PLAN V') {
      this.previousBalanceArs -= getNumber(parts[4])
      return
    }
    let dateFormat = null
    if (parts[0].match(/\d{2}\.\d{2}\.\d{2}/) !== null) {
      dateFormat = 'DD.MM.YY'
    }
    if (parts[0].match(/\d{2}\/\d{2}\/\d{4}/) !== null) {
      dateFormat = 'DD/MM/YYYY'
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
      this.period,
      parseFloat(this.previousBalanceArs.toFixed(2)),
      1,
      1
    )
  }
}
