import moment from "moment";
import AMEXImportAdapter from "~/services/import/adapters/AMEXImportAdapter";
import AMEXRebankingLines from "~/test/services/adapters/resources/AMEXRebankingLines";

describe('When using AMEXRebankingLines', () => {
  test('AMEXImportAdapter.runImport, happy path.', () => {
    const adapter = new AMEXImportAdapter()

    expect(adapter.canImport(AMEXRebankingLines)).toBe(true)
    const items = adapter.runImport(AMEXRebankingLines)

    expect(items).toHaveLength(14)
    expect(items.reduce((sum, item) => sum + item.amountArs, 0).toFixed(2)).toBe('30012.51')
    items.forEach(item => {
      expect(moment(item.period.date).format("YYYY-MM-DD")).toBe('2022-05-19')
      expect(item.period.minArs).toBe(10413)
      expect(item.account.id).toBe('REBANKING-AMEX')
    })
  })
})
