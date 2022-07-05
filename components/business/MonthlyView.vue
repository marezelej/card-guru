<template>
  <v-card>
    <v-card-title class="headline">
      Compromisos mensuales
    </v-card-title>
    <v-card-text>
      <TheInfoCard
        v-for="account in accounts"
        :key="'account_' + account.id"
        :title="account.title"
        :color="account.color"
        class="mb-1"
      >
        MIN. $ {{ account.totalMinArs.toFixed(2) }} / TOTAL AR$ {{ account.totalArs.toFixed(2) }} (% {{ account.quote.toFixed(2) }})
      </TheInfoCard>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import {orderBy} from "lodash";
import TheInfoCard from "~/components/cards/TheInfoCard";
export default {
  components: {TheInfoCard},
  props: {
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    accounts() {
      const today = moment(this.date).format('YYYY-MM')
      const accounts = {}
      let totalArs = 0
      let totalMinArs = 0
      this.$store.state.expenses.list
        .filter(expense => moment(expense.period.date).format('YYYY-MM') === today)
        .forEach(expense => {
          accounts[expense.account.id] = accounts[expense.account.id] || {
            ...expense.account,
            totalArs: 0,
            totalMinArs: 0,
            quote: 0,
          }
          accounts[expense.account.id].totalArs += expense.amountArs
          accounts[expense.account.id].totalMinArs += 0
          totalArs += expense.amountArs
          totalMinArs += 0
        })
      Object.values(accounts).forEach(account => {
        account.quote = account.totalArs * 100 / totalArs
      })
      const result = orderBy(Object.values(accounts), ['quote'], ['desc'])
      result.push({
        id: 'SUM',
        title: 'TOTAL',
        color: 'secondary',
        totalArs,
        totalMinArs,
        quote: 100.00,
      })
      return result
    }
  }
}
</script>

<style scoped>

</style>
