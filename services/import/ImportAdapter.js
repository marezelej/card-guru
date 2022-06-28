export default class ImportAdapter {
  account = {}
  period = null
  items = []

  canImport(lines) { return false }
  beforeImport(lines) {}
  import(line) {}
  afterImport(lines) {}

  getItems() {
    return this.items
  }

  pushItem(title, date, amountArs, feeNumber, totalFees) {
    const item = {title, date, account: this.account, period: this.period, amountArs, feeNumber, totalFees}
    this.items.push(item)
  }

  unshiftItem(title, date, amountArs, feeNumber, totalFees) {
    const item = {title, date, account: this.account, period: this.period, amountArs, feeNumber, totalFees}
    this.items.unshift(item)
  }
}
