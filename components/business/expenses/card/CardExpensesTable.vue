<template>
  <TheFilterTable
    :items="items"
    :total="total"
    :headers="headers"
    :page-info.sync="pageInfo"
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
        </v-col>
      </v-row>
    </template>
  </TheFilterTable>
</template>

<script>
import TheFilterTable from "~/components/tables/TheFilterTable";
import FormatDateMixin from "~/mixins/common/FormatDateMixin";
export default {
  name: "CardExpensesTable",
  components: {TheFilterTable},
  mixins: [FormatDateMixin],
  data() {
    return {
      pageInfo: {
        page: 1,
        itemsPerPage: 20
      },
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
      const start = (this.pageInfo.page - 1) * this.pageInfo.itemsPerPage
      const end = start + this.pageInfo.itemsPerPage
      return this.$store.state.expenses.cardList.slice(start, end)
    },
    total() {
      return this.$store.state.expenses.cardList.length
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
