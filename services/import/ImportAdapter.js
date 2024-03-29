import moment from "moment";
import {getDate, getNumber} from "~/services/import/adapters/utils";

export default class ImportAdapter {
  account = {id: null, title: null, color: 'primary'}
  period = {id: null, date: null, expirationDate: null, minArs: 0}
  items = []

  runImport(lines) {
    this.beforeImport(lines)
    lines.forEach(line => this.import(line))
    this.afterImport(lines)
    return this.getItems()
  }

  canImport(lines) { return false }
  beforeImport(lines) {}
  import(line) {}
  afterImport(lines) {}

  getItems() {
    return this.items
  }

  setPeriod(strDate) {
    this.period.id = getDate(strDate).format('YYYY-MM')
    this.period.date = getDate(strDate).toDate()
  }

  setPeriodMinArs(strMinArs) {
    this.period.minArs = getNumber(strMinArs)
  }

  setPeriodExpirationDate(strDate) {
    this.period.expirationDate = getDate(strDate).toDate()
  }

  pushItem(title, date, amountArs, feeNumber, totalFees) {
    const item = {title, date, account: this.account, period: this.period, amountArs, feeNumber, totalFees}
    this.items.push(this.getItem(item))
  }

  unshiftItem(title, date, amountArs, feeNumber, totalFees) {
    const item = {title, date, account: this.account, period: this.period, amountArs, feeNumber, totalFees}
    this.items.unshift(this.getItem(item))
  }

  getItem(item) {
    item.id = item.title + '-' + item.account.id + '-' + moment(item.date).format('YYYY-MM-DD') + '-' + item.period.id
    return item;
  }
}
