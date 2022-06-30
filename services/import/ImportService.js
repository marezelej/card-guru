import VisaImportAdapter from "~/services/import/adapters/VisaImportAdapter";

export default class ImportService {
  getAdapters() {
    return [
      new VisaImportAdapter()
    ]
  }

  import(lines) {
    const adapter = this.getAdapters().find(a => a.canImport(lines))
    if (!adapter) {
      throw new MissingAdapterError("No adapter was match")
    }
    adapter.runImport(lines)
    return adapter.getItems()
  }
}

export class MissingAdapterError extends Error {
}
