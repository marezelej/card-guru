import moment from "moment";
import ImportAdapter from "~/services/import/ImportAdapter";
export default class VisaImportAdapter extends ImportAdapter {
  account = {id: 'VISA', title: 'VISA', color: 'primary'}
  previousBalanceArs = 0

  canImport(lines) {
    for (const line of lines) {
      if (line.includes('Galicia Visa Platinum')) {
        this.account.id = 'GaliciaVisaPlatinum'
        this.account.title = 'Galicia Visa Platinum'
        return true
      }
    }
    return false
  }

  import(line) {
    const parts = line.split(' ')
    if (line.startsWith('CIERRE ACTUAL: ')) {
      this.period = moment(line.replace('CIERRE ACTUAL: ', '')).toDate()
      return;
    }
    if (parts.slice(0, 2).join(' ') === 'SALDO ANTERIOR') {
      this.previousBalanceArs += this.getNumber(parts[2])
      return;
    }
    if (parts.slice(1, 5).join(' ') === 'SU PAGO EN PESOS') {
      this.previousBalanceArs -= this.getNumber(parts[5])
      return;
    }
    if (parts.slice(1, 4).join(' ') === 'CR.$ PLAN V') {
      this.previousBalanceArs -= this.getNumber(parts[4])
      return;
    }
    if (parts[0].match(/\d{2}\.\d{2}\.\d{2}/) !== null) {
      let lastIndex = parts.length - 1
      while (lastIndex >= 0 && isNaN(this.getNumber(parts[lastIndex]))) {
        lastIndex--
      }
      if (lastIndex < 0) {
        return
      }
      const feeInfo = this.getFeeInfo(parts)
      this.pushItem(
        parts.slice(1, lastIndex).join(' '),
        moment(parts[0], 'DD.MM.YY').toDate(),
        this.getNumber(parts[lastIndex]),
        feeInfo.feeNumber,
        feeInfo.totalFees
      )
    }
  }

  getNumber(str) {
    return parseFloat(str.replace('.', '').replace(',', '.').replace('-', ''))
  }

  getFeeInfo(parts) {
    let feeNumber = 1
    let totalFees = 1
    const feeInfo = parts.find((str) => str.match(/\d{2}\/\d{2}/) !== null || str.match(/\d{1,2}-\d{2}/) !== null)
    if (feeInfo) {
      if (feeInfo.length === 4) {
        feeNumber = parseInt(feeInfo.slice(0, 2))
        totalFees = parseInt(feeInfo.slice(2, 4))
      } else if (feeInfo.length === 5) {
        feeNumber = parseInt(feeInfo.slice(0, 3))
        totalFees = parseInt(feeInfo.slice(3, 5))
      }
    }
    return {
      feeNumber,
      totalFees
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
