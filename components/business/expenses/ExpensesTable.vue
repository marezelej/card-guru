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
          text: this.$t('Source'),
          value: 'account.title',
        },
        {
          text: this.$t('Date'),
          value: 'date',
        },
        {
          text: this.$t('Amount (AR$)'),
          value: 'amountArs',
        },
        {
          text: this.$t('Fee number'),
          value: 'feeNumber',
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
