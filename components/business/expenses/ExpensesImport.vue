<template>
  <v-file-input
    v-model="files"
    :loading="loading > 0"
    :label="$t('Importar resumen de tarjeta')"
    multiple
    hide-details
    @change="loadFile"
  />
</template>

<script>
import ImportService from "~/services/import/ImportService";
export default {
  name: 'ExpensesImport',
  data() {
    return {
      loading: 0,
      files: [],
      enableLog: true
    }
  },
  methods: {
    loadFile() {
      for (const file of this.files) {
        const reader = new FileReader();
        this.loading++
        reader.onload = (e) => {
          const pdfParser = window['pdfjs-dist/build/pdf']
          const loadingTask = pdfParser.getDocument({data: e.target.result})
          loadingTask.promise.then((pdf) => {
            this.importData(pdf)
          }).catch((e) => {
            this.log('Import ERROR:', { e })
            alert('Unexpected error, please retry...')
          }).finally(() => {
            this.loading--
          })
        }
        reader.readAsBinaryString(file)
      }
      this.files = []
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
      for (const item of items) {
        if (this.$store.state.expenses.cardList.find(expense => expense.id === item.id)) {
          alert(this.$t('Some items are already loaded!'))
          return
        }
      }
      this.$store.commit('expenses/addCard', items)
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
