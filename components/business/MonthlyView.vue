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
      this.$store.state.expenses.cardList
        .filter(expense => moment(expense.period.date).format('YYYY-MM') === today)
        .forEach(expense => {
          accounts[expense.account.id] = accounts[expense.account.id] || {
            ...expense.account,
            totalArs: 0,
            totalMinArs: expense.period.minArs,
            quote: 0,
          }
          accounts[expense.account.id].totalArs += expense.amountArs
          totalArs += expense.amountArs
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
        totalMinArs: result.reduce((sum, account) => sum + account.totalMinArs, 0),
        quote: 100.00,
      })
      return result
    }
  }
}
</script>

<style scoped>

</style>
