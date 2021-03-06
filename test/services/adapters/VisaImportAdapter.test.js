import moment from "moment";
import VisaImportAdapter from "@/services/import/adapters/VisaImportAdapter";
import BersaLines from "~/test/services/adapters/resources/VisaBersaLines";
import GaliciaLines from "~/test/services/adapters/resources/VisaGaliciaLines";
import HipotecarioLines from "~/test/services/adapters/resources/VisaHipotecarioLines";

describe('When using GaliciaLines', () => {
  test('VisaImportAdapter.runImport, happy path.', () => {
    const adapter = new VisaImportAdapter()

    expect(adapter.canImport(GaliciaLines)).toBe(true)
    const items = adapter.runImport(GaliciaLines)

    expect(items).toHaveLength(28)
    expect(items.reduce((sum, item) => sum + item.amountArs, 0).toFixed(2)).toBe('55742.88')
    items.forEach(item => {
      expect(moment(item.period.date).format("YYYY-MM-DD")).toBe('2022-05-19')
      expect(item.period.minArs).toBe(30280)
      expect(item.account.id).toBe('GALICIA-VISA-PLATINUM')
    })
  })
})

describe('When using BersaLines', () => {
  test('VisaImportAdapter.runImport, happy path.', () => {
    const adapter = new VisaImportAdapter()

    expect(adapter.canImport(BersaLines)).toBe(true)
    const items = adapter.runImport(BersaLines)

    expect(items).toHaveLength(14)
    expect(items.reduce((sum, item) => sum + item.amountArs, 0).toFixed(2)).toBe('41687.88')
    items.forEach(item => {
      expect(moment(item.period.date).format("YYYY-MM-DD")).toBe('2022-05-26')
      expect(item.period.minArs).toBe(5488)
      expect(item.account.id).toBe('BANCO-ENTRE-RIOS')
    })
  })
})

describe('When using HipotecarioLines', () => {
  test('VisaImportAdapter.runImport, happy path.', () => {
    const adapter = new VisaImportAdapter()

    expect(adapter.canImport(HipotecarioLines)).toBe(true)
    const items = adapter.runImport(HipotecarioLines)

    expect(items).toHaveLength(23)
    expect(items.reduce((sum, item) => sum + item.amountArs, 0).toFixed(2)).toBe('36834.09')
    items.forEach(item => {
      expect(moment(item.period.date).format("YYYY-MM-DD")).toBe('2022-05-26')
      expect(item.period.minArs).toBe(16922)
      expect(item.account.id).toBe('HIPOTECARIO-VISA')
    })
  })
})
