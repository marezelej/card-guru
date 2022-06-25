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
import AccountCard from "~/components/cards/AccountCard";
export default {
  components: {AccountCard},
  computed: {
    accounts() {
      return []
    }
  }
}
</script>

<style scoped>

</style>
