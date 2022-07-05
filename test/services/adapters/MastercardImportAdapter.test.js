import moment from "moment";
import MastercardImportAdapter from "~/services/import/adapters/MastercardImportAdapter";
import MastercardLines from "~/test/services/adapters/resources/MastercardLines";

describe('When using MastercardLines', () => {
  test('MastercardImportAdapter.runImport, happy path.', () => {
    const adapter = new MastercardImportAdapter()

    expect(adapter.canImport(MastercardLines)).toBe(true)
    const items = adapter.runImport(MastercardLines)

    expect(items).toHaveLength(33)
    expect(items.reduce((sum, item) => sum + item.amountArs, 0).toFixed(2)).toBe('82611.67')
    items.forEach(item => {
      expect(moment(item.period.date).format("YYYY-MM-DD")).toBe('2022-05-26')
      expect(item.period.minArs).toBe(38590)
      expect(item.account.id).toBe('GALICIA-MASTERCARD-PLATINUM')
    })
  })
})
