import VisaImportAdapter from "@/services/import/adapters/VisaImportAdapter";

test('VisaImportAdapter can import "Galicia Visa Platinum" lines.', () => {
  const adapter = new VisaImportAdapter()
  const lines = ['I am a Galicia Visa Platinum resume']

  expect(adapter.canImport(lines)).toBe(true)
});
