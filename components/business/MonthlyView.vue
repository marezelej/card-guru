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
        <v-row>
          <v-col cols="10">
            MIN. $ {{ account.totalMinArs.toFixed(2) }} / TOTAL AR$ {{ account.totalArs.toFixed(2) }} (% {{ account.quote.toFixed(2) }})
          </v-col>
          <v-col v-if="!['SUM', 'PENDING'].includes(account.id)" cols="2" class="text-right">
            <v-simple-checkbox title="Pagado" :value="account.isPayed" @input="handleCheckPayed(account)"/>
          </v-col>
        </v-row>
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
  data() {
    return {
      payedAccounts: []
    }
  },
  computed: {
    periodKey() {
      return moment(this.date).format('YYYY-MM')
    },
    accounts() {
      const accounts = {}
      let totalArs = 0
      this.$store.state.expenses.cardList
        .filter(expense => moment(expense.period.date).format('YYYY-MM') === this.periodKey)
        .forEach(expense => {
          accounts[expense.account.id] = accounts[expense.account.id] || {
            ...expense.account,
            totalArs: 0,
            totalMinArs: expense.period.minArs,
            quote: 0,
            isPayed: this.$store.state.expenses.payedAccounts.includes(this.periodKey + expense.account.id),
          }
          accounts[expense.account.id].totalArs += expense.amountArs
          totalArs += expense.amountArs
        })
      Object.values(accounts).forEach(account => {
        account.quote = account.totalArs * 100 / totalArs
      })
      const result = orderBy(Object.values(accounts), ['quote'], ['desc'])
      const extra = []
      extra.push({
        id: 'SUM',
        title: 'Total',
        color: 'blue',
        totalArs,
        pendingTotalArs: result.filter(a => !a.isPayed).reduce((sum, account) => sum + account.totalArs, 0),
        totalMinArs: result.reduce((sum, account) => sum + account.totalMinArs, 0),
        quote: 100.00,
      })
      const pendingTotalArs = result.filter(a => !a.isPayed).reduce((sum, account) => sum + account.totalArs, 0)
      extra.push({
        id: 'PENDING',
        title: 'Pendiente',
        color: 'indigo',
        totalArs: pendingTotalArs,
        totalMinArs: result.filter(a => !a.isPayed).reduce((sum, account) => sum + account.totalMinArs, 0),
        quote: pendingTotalArs * 100 / totalArs,
      })
      result.push(...extra)
      return result
    },
  },
  methods: {
    handleCheckPayed(account) {
      this.$store.commit('expenses/setPayed', {
        payKey: this.periodKey + account.id,
        isPayed: !account.isPayed
      })
    }
  }
}
</script>

<style scoped>

</style>
