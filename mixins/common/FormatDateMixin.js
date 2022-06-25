import moment from 'moment'
export default {
  methods: {
    formatDate (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    formatDatePeriod (date) {
      const periodMonth = moment(date).format('MM')
      const periodYear = moment(date).format('YYYY')
      return `${periodMonth}/${periodYear}`
    },
    isPast (dateString) {
      const rawDate = moment(dateString.replaceAll('/', '-'), 'DD/MM/YYYY').format('YYYY/MM/DD')
      const date = new Date(rawDate)
      const now = new Date()
      return date < now
    },
    isNearExpiration (dateStr) {
      const rawDate = moment(dateStr.replaceAll('/', '-'), 'DD/MM/YYYY').format('YYYY/MM/DD')
      const date = new Date(rawDate)
      const nearDate = new Date()
      const datesToExpire = 7
      nearDate.setDate(nearDate.getDate() + datesToExpire)
      return date < nearDate
    },
    month (date) {
      moment.locale('es')
      return moment(date).format('MMMM')
    },
    year (date) {
      return moment(date).format('YYYY')
    },
    day (date) {
      return moment(date).format('DD')
    }
  }
}
