<template>
  <TheFilterTable
    :items="items"
    :headers="headers"
    :sort-by="['date']"
    :sort-desc="[true]"
  >
    <template #[`item.date`]="{ item }">
      {{ formatDate(item.date) }}
    </template>
    <template #[`item.period`]="{ item }">
      {{ formatPeriod(item.period.date) }}
    </template>
    <template #[`item.expirationDate`]="{ item }">
      {{ formatDate(item.period.expirationDate) }}
    </template>
    <template #[`item.amountArs`]="{ item }">
      {{ item.amountArs < 0? '-$' + (-1 * item.amountArs).toFixed(2) : '$' + item.amountArs.toFixed(2) }}
    </template>
    <template #[`item.feeInfo`]="{ item }">
      {{ item.feeNumber }} / {{ item.totalFees }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-row>
        <v-col>
          <v-icon title="Borrar" @click="clickDelete(item)">mdi-delete</v-icon>
          <CreateCardExpenseModal :duplicate="item">
            <template #activator="{on}">
              <v-icon title="Duplicar" v-on="on">mdi-content-copy</v-icon>
            </template>
          </CreateCardExpenseModal>
        </v-col>
      </v-row>
    </template>
  </TheFilterTable>
</template>

<script>
import TheFilterTable from "~/components/tables/TheFilterTable";
import FormatDateMixin from "~/mixins/common/FormatDateMixin";
import CreateCardExpenseModal from "~/components/business/expenses/card/CreateCardExpenseDialog";
export default {
  name: "CardExpensesTable",
  components: {CreateCardExpenseModal, TheFilterTable},
  mixins: [FormatDateMixin],
  data() {
    return {
      headers: [
        {
          text: this.$t('Título'),
          value: 'title',
        },
        {
          text: this.$t('Cuenta'),
          value: 'account.title',
        },
        {
          text: this.$t('Fecha'),
          value: 'date',
        },
        {
          text: this.$t('Período'),
          value: 'period',
        },
        {
          text: this.$t('Vencimiento'),
          value: 'expirationDate',
        },
        {
          text: this.$t('Monto (AR$)'),
          value: 'amountArs',
        },
        {
          text: this.$t('Cuota / Total'),
          value: 'feeInfo',
        },
        {
          text: this.$t('Acciones'),
          value: 'actions',
        },
      ]
    }
  },
  computed: {
    items() {
      return this.$store.state.expenses.cardList
    }
  },
  methods: {
    clickDelete(item) {
      this.$store.commit('expenses/deleteCard', item)
    }
  }
}
</script>

<style scoped>

</style>
