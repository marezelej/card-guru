<template>
  <v-card>
    <v-card-title class="headline">
      Compromisos mensuales
    </v-card-title>
    <v-card-text>
      <TheInfoCard
        v-for="account in accounts"
        :key="'account_' + account.id"
        :title="account.title + ' - $' + account.totalMinArs.toFixed(2)"
        :color="account.color"
        class="mb-1"
      >
        <v-row>
          <v-col cols="10">
            MIN: ${{ account.totalMinArs.toFixed(2) }} (%{{ account.quote.toFixed(2) }}) - VTO: {{ account.expirationDate }}
          </v-col>
          <v-col cols="2" class="text-right">
            <v-simple-checkbox title="Pagado" :value="account.isPayed" @input="handleCheckPayed(account)"/>
          </v-col>
        </v-row>
      </TheInfoCard>
      <TheInfoCard
        color="blue"
      >
        TOTAL: ${{ totalArs.toFixed(2) }} - MIN: ${{ minArs.toFixed(2) }} - PENDIENTE: ${{ pendingArs.toFixed(2) }}
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
    periodDate() {
      return moment(this.date).format('YYYY-MM')
    },
    accounts() {
      const accounts = {}
      let totalArs = 0
      this.$store.state.expenses.cardList
        .filter(expense => moment(expense.period.date).format('YYYY-MM') === this.periodDate)
        .forEach(expense => {
          const accountKey = expense.account.id + moment(expense.period.expirationDate).format('MM-DD')
          accounts[accountKey] = accounts[accountKey] || {
            ...expense.account,
            totalArs: 0,
            totalMinArs: expense.period.minArs,
            quote: 0,
            expirationDate: moment(expense.period.expirationDate).format('MM/DD'),
            isPayed: this.$store.state.expenses.payedAccounts.includes(this.periodDate + expense.account.id),
          }
          accounts[accountKey].totalArs += expense.amountArs
          totalArs += expense.amountArs
        })
      Object.values(accounts).forEach(account => {
        account.quote = account.totalArs * 100 / totalArs
      })
      return orderBy(Object.values(accounts), ['quote'], ['desc'])
    },
    totalArs() {
      return this.accounts.reduce((sum, account) => sum + account.totalArs, 0)
    },
    minArs() {
      return this.accounts.reduce((sum, account) => sum + account.totalMinArs, 0)
    },
    pendingArs() {
      return this.accounts.filter(a => !a.isPayed).reduce((sum, account) => sum + account.totalArs, 0)
    },
  },
  methods: {
    handleCheckPayed(account) {
      this.$store.commit('expenses/setPayed', {
        payKey: this.periodDate + account.id,
        isPayed: !account.isPayed
      })
    }
  }
}
</script>

<style scoped>

</style>
