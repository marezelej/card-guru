<template>
  <v-card>
    <v-card-title class="headline">
      Compromisos mensuales
    </v-card-title>
    <v-card-text>
      <AccountCard
        v-for="account in accounts"
        :key="'account_' + account.id"
        :account="account"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import AccountCard from "~/components/cards/AccountCard";
export default {
  components: {AccountCard},
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
      this.$store.state.expenses.list
        .filter(expense => moment(expense.period).format('YYYY-MM') === today)
        .forEach(expense => {
          accounts[expense.account.id] = accounts[expense.account.id] || {
            ...expense.account,
            totalArs: 0,
            quote: 0,
          }
          accounts[expense.account.id].totalArs += expense.amountArs
          totalArs += expense.amountArs
        })
      Object.values(accounts).forEach(account => {
        account.quote = account.totalArs * 100 / totalArs
      })
      return Object.values(accounts)
    }
  }
}
</script>

<style scoped>

</style>
