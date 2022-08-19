<template>
  <v-card>
    <v-card-title class="headline">
      Proyección mensual
    </v-card-title>
    <v-card-text>
      <v-card
        v-for="month in months"
        :key="'month_' + month.title"
        :color="month.color"
        class="mb-1"
      >
        <v-card-title class="pa-2 pl-4">
          {{ month.title + ' - $' + month.totalArs.toFixed(2) }}
        </v-card-title>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  props: {
    date: {
      type: String,
      required: true
    },
    nMonths: {
      type: Number,
      required: true
    }
  },
  computed: {
    periodExpenses() {
      const periodKey = moment(this.date).format('YYYY-MM')
      return this.$store.state.expenses.cardList
        .filter(expense => moment(expense.period.date).format('YYYY-MM') === periodKey)
    },
    months() {
      const month = moment(this.date).startOf('month')
      const months = []
      for (let i = 0; i < this.nMonths; i++) {
        months.push({
          title: month.format('YYYY/MM'),
          color: this.getMonthColor(i),
          totalArs: this.getMonthTotalArs(month)
        })
        month.add(1, 'months')
      }
      return months
    }
  },
  methods: {
    getMonthColor(i) {
      return 'primary'
    },
    getMonthTotalArs(month) {
      return this.periodExpenses
        .filter(expense => {
          const remainingFees = expense.totalFees - expense.feeNumber + 1
          const lastPeriod = moment(expense.period.date).startOf('month').add(remainingFees, 'months')
          return lastPeriod.isAfter(month)
        })
        .reduce((sum, expense) => sum + expense.amountArs, 0)
    }
  }
}
</script>

<style scoped>

</style>
