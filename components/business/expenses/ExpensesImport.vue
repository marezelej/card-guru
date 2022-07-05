<template>
  <v-file-input
    v-model="file"
    :loading="loading"
    :label="$t('Load expenses file')"
    @change="loadFile"
  />
</template>

<script>
import ImportService from "~/services/import/ImportService";
export default {
  name: 'ExpensesImport',
  data() {
    return {
      loading: false,
      file: null,
      enableLog: true
    }
  },
  methods: {
    loadFile() {
      if (!this.file) {
        return
      }
      this.loading = true
      const reader = new FileReader();
      reader.onload = (e) => {
        const pdfParser = window['pdfjs-dist/build/pdf']
        const loadingTask = pdfParser.getDocument({data: e.target.result})
        loadingTask.promise.then((pdf) => {
          this.importData(pdf)
        }).catch((e) => {
          this.log('Import ERROR:', { e })
          alert('Unexpected error, please retry...')
        }).finally(() => {
          this.file = null
          this.loading = false
        })
      }
      reader.readAsBinaryString(this.file)
    },
    async importData(pdf) {
      this.log('Imported PDF:', pdf)
      const service = new ImportService()
      const lines = []
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        this.log('Imported page: ' + i, content)
        content.items.forEach((item) => {
          text += item.str
          if (item.hasEOL) {
            lines.push(text)
            text = ''
          }
        })
        lines.push(text)
        text = ''
      }
      this.log('Imported LINES:', lines)
      const items = service.import(lines)
      this.log('Imported ITEMS:', items)
      this.$store.commit('expenses/add', items)
    },
    log(msg, payload) {
      if (this.enableLog) {
        // eslint-disable-next-line no-console
        console.log(msg)
        // eslint-disable-next-line no-console
        console.log(payload)
      }
    }
  }
}
</script>
