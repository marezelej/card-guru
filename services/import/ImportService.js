import VisaImportAdapter from "~/services/import/adapters/VisaImportAdapter";
import AMEXImportAdapter from "~/services/import/adapters/AMEXImportAdapter";
import MastercardImportAdapter from "~/services/import/adapters/MastercardImportAdapter";

export default class ImportService {
  getAdapters() {
    return [
      new VisaImportAdapter(),
      new AMEXImportAdapter(),
      new MastercardImportAdapter(),
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
