import moment from "moment";
import {getDate, getFeeInfo, getNumber} from "./utils"
import ImportAdapter from "~/services/import/ImportAdapter";
export default class AMEXImportAdapter extends ImportAdapter {
  account = {id: 'AMEX', title: 'AMEX', color: 'primary'}
  previousBalanceArs = 0

  canImport(lines) {
    for (const line of lines) {
      if (line === '999 - C.A.B.A') {
        this.account.id = 'REBANKING-AMEX'
        this.account.title = 'Rebanking (AMEX)'
        return true
      }
    }
    return false
  }

  beforeImport(lines) {
    lines.forEach(line => {
      if (line.match(/\d{2} [A-Za-z]{3} \d{2}/) !== null) {
        this.period = getDate(line).toDate()
      }
    })
  }

  import(line) {
    const parts = line.split(' ')
    let lastIndex = parts.length - 1
    if (parts.slice(0, 2).join(' ') === 'SALDO ANTERIOR' && parts[2] !== undefined) {
      this.previousBalanceArs += getNumber(parts[2])
      return
    }
    if (parts.slice(1, 5).join(' ') === 'SU PAGO EN PESOS') {
      this.previousBalanceArs -= getNumber(parts[5])
      return
    }
    let dateFormat = null
    if (parts[0].match(/\d{2}\.\d{2}\.\d{4}/) !== null) {
      dateFormat = 'DD.MM.YYYY'
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
