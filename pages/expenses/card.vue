<template>
  <div>
    <v-row>
      <v-col>
        <h1>{{ $t('Gastos de tarjeta') }}</h1>
      </v-col>
      <v-col>
        <v-row align="center" justify="center" class="pt-3 mr-0">
          <ExpensesImport class="mr-2 mt-0" />
          <CreateCardExpenseModal />
        </v-row>
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
import CreateCardExpenseModal from "~/components/business/expenses/card/CreateCardExpenseDialog";
export default {
  name: 'ExpensesCardPage',
  components: {CreateCardExpenseModal, ExpensesTable, ExpensesImport},
  mounted() {
    this.$store.commit('expenses/load')
  }
}
</script>
