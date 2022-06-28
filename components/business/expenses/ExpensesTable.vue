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
      {{ formatPeriod(item.period) }}
    </template>
    <template #[`item.amountArs`]="{ item }">
      {{ item.amountArs < 0? '-$' + (-1 * item.amountArs).toFixed(2) : '$' + item.amountArs.toFixed(2) }}
    </template>
    <template #[`item.feeInfo`]="{ item }">
      {{ item.feeNumber }} / {{ item.totalFees }}
    </template>
  </TheFilterTable>
</template>

<script>
import TheFilterTable from "~/components/tables/TheFilterTable";
import FormatDateMixin from "~/mixins/common/FormatDateMixin";
export default {
  name: "ExpensesTable",
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
          text: this.$t('Title'),
          value: 'title',
        },
        {
          text: this.$t('Account'),
          value: 'account.title',
        },
        {
          text: this.$t('Date'),
          value: 'date',
        },
        {
          text: this.$t('Period'),
          value: 'period',
        },
        {
          text: this.$t('Amount (AR$)'),
          value: 'amountArs',
        },
        {
          text: this.$t('Fees'),
          value: 'feeInfo',
        },
      ]
    }
  },
  computed: {
    items() {
      const start = (this.pageInfo.page - 1) * this.pageInfo.itemsPerPage
      const end = start + this.pageInfo.itemsPerPage
      return this.$store.state.expenses.list.slice(start, end)
    },
    total() {
      return this.$store.state.expenses.list.length
    }
  }
}
</script>

<style scoped>

</style>
