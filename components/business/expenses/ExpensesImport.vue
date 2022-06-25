<template>
  <v-file-input
    v-model="file"
    :loading="loading"
    :label="$t('Load expenses file')"
    @change="loadFile"
  />
</template>

<script>
import moment from "moment";
export default {
  name: 'ExpensesImport',
  data() {
    return {
      loading: false,
      file: null,
      parsedPdf: null
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
          this.parsedPdf = pdf
          this.importData(pdf)
        }).catch((e) => {
          console.log(e)
          alert('Unexpected error, please retry...')
        }).finally(() => {
          this.file = null
          this.loading = false
        })
      }
      reader.readAsBinaryString(this.file)
    },
    async importData(pdf) {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        this.importPageContent(content)
      }
      console.log(this.$store.state.expenses.list)
    },
    importPageContent(content) {
      const lines = []
      let text = ''
      content.items.forEach((item) => {
        text += item.str
        if (item.hasEOL) {
          lines.push(text)
          text = ''
        }
      })
      const source = {id: 1, title: 'VISA GALICIA'}
      const getNumber = (str) => parseFloat(str.replace('.', '').replace(',', '.').replace('-', ''))
      lines.forEach((line) => {
        const parts = line.split(' ')
        if (parts[0].match(/\d{2}\.\d{2}\.\d{2}/) !== null) {
          let lastIndex = parts.length - 1
          while (lastIndex >= 0 && isNaN(getNumber(parts[lastIndex]))) {
            lastIndex--
          }
          if (lastIndex < 0) {
            return
          }
          const feeInfo = parts.find((str) => str.match(/\d{2}\/\d{2}/) !== null)
          this.addItem(
            parts.slice(1, lastIndex).join(' '),
            moment(parts[0], 'DD.MM.YY').toDate(),
            source,
            getNumber(parts[lastIndex]),
            feeInfo? parseInt(feeInfo.slice(3)) : 1
          )
        }
      })
    },
    addItem(title, date, account, amountArs, feeNumber) {
      this.$store.commit('expenses/add', {title, date, account, amountArs, feeNumber})
    }
  }
}
</script>
