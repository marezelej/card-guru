export default class ImportAdapter {
  account = {id: null, title: null, color: 'primary'}
  period = null
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

  pushItem(title, date, amountArs, feeNumber, totalFees) {
    const item = {title, date, account: this.account, period: this.period, amountArs, feeNumber, totalFees}
    this.items.push(item)
  }

  unshiftItem(title, date, amountArs, feeNumber, totalFees) {
    const item = {title, date, account: this.account, period: this.period, amountArs, feeNumber, totalFees}
    this.items.unshift(item)
  }
}
