<template>
  <div>
    <v-row>
      <v-col>
        <h1>{{ $t('Gastos de tarjeta') }}</h1>
      </v-col>
      <v-col>
        <v-row align="center" justify="center" class="pt-3 mr-0">
          <CardExpensesImport class="mr-2 mt-0" />
          <CreateCardExpenseModal />
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <CardExpensesTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CardExpensesTable from "~/components/business/expenses/card/CardExpensesTable";
import CardExpensesImport from "~/components/business/expenses/card/CardExpensesImport";
import CreateCardExpenseModal from "~/components/business/expenses/card/CreateCardExpenseDialog";
export default {
  name: 'ExpensesCardPage',
  components: {CreateCardExpenseModal, CardExpensesTable, CardExpensesImport},
  mounted() {
    this.$store.commit('expenses/load')
  }
}
</script>
