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
      parsedPdf: null,
      previousBalanceArs: 0,
      period: '',
      items: []
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
        }).catch(() => {
          alert('Unexpected error, please retry...')
        }).finally(() => {
          this.file = null
          this.loading = false
        })
      }
      reader.readAsBinaryString(this.file)
    },
    async importData(pdf) {
      this.previousBalanceArs = 0
      this.period = ''
      this.items = []
      const source = {id: 1, title: 'VISA GALICIA', color: 'primary'}
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        this.importPageContent(content, source)
      }
      this.addItem(
        'Balance anterior',
        this.period,
        source,
        parseFloat(this.previousBalanceArs.toFixed(2)),
        1,
        1,
        'unshift'
      )
      this.$store.commit('expenses/add', this.items)
    },
    importPageContent(content, source) {
      const lines = []
      let text = ''
      content.items.forEach((item) => {
        text += item.str
        if (item.hasEOL) {
          lines.push(text)
          text = ''
        }
      })
      const getNumber = (str) => {
        return parseFloat(str.replace('.', '').replace(',', '.').replace('-', ''))
      }
      lines.forEach((line) => {
        const parts = line.split(' ')
        if (line.startsWith('CIERRE ACTUAL: ')) {
          this.period = moment(line.replace('CIERRE ACTUAL: ', '')).toDate()
          return;
        }
        if (parts.slice(0, 2).join(' ') === 'SALDO ANTERIOR') {
          this.previousBalanceArs += getNumber(parts[2])
          return;
        }
        if (parts.slice(1, 5).join(' ') === 'SU PAGO EN PESOS') {
          this.previousBalanceArs -= getNumber(parts[5])
          return;
        }
        if (parts.slice(1, 4).join(' ') === 'CR.$ PLAN V') {
          this.previousBalanceArs -= getNumber(parts[4])
          return;
        }
        if (parts[0].match(/\d{2}\.\d{2}\.\d{2}/) !== null) {
          let lastIndex = parts.length - 1
          while (lastIndex >= 0 && isNaN(getNumber(parts[lastIndex]))) {
            lastIndex--
          }
          if (lastIndex < 0) {
            return
          }
          const feeInfo = this.getFeeInfo(parts)
          this.addItem(
            parts.slice(1, lastIndex).join(' '),
            moment(parts[0], 'DD.MM.YY').toDate(),
            source,
            getNumber(parts[lastIndex]),
            feeInfo.feeNumber,
            feeInfo.totalFees
          )
        }
      })
    },
    getFeeInfo(parts) {
      let feeNumber = 1
      let totalFees = 1
      const feeInfo = parts.find((str) => str.match(/\d{2}\/\d{2}/) !== null || str.match(/\d{1,2}-\d{2}/) !== null)
      if (feeInfo) {
        if (feeInfo.length === 4) {
          feeNumber = parseInt(feeInfo.slice(0, 2))
          totalFees = parseInt(feeInfo.slice(2, 4))
        } else if (feeInfo.length === 5) {
          feeNumber = parseInt(feeInfo.slice(0, 3))
          totalFees = parseInt(feeInfo.slice(3, 5))
        }
      }
      return {
        feeNumber,
        totalFees
      }
    },
    addItem(title, date, account, amountArs, feeNumber, totalFees, action = 'push') {
      const item = {title, date, period: this.period, account, amountArs, feeNumber, totalFees}
      if (action === 'unshift') {
        this.items.unshift(item)
      } else {
        this.items.push(item)
      }
    }
  }
}
</script>
