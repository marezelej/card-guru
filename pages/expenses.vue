<template>
  <div>
    <v-row>
      <v-col>
        <h1>{{ $t('Expenses') }}</h1>
      </v-col>
      <v-col>
        <ExpensesImport />
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <ExpensesTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ExpensesTable from "~/components/business/expenses/ExpensesTable";
import ExpensesImport from "~/components/business/expenses/ExpensesImport";
export default {
  name: 'ExpensesPage',
  components: {ExpensesTable, ExpensesImport},
  mounted() {
    this.$store.commit('expenses/load')
  }
}
</script>
