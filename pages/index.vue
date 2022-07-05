<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-form>
        <TheDateInput v-model="today" :clearable="false" />
      </v-form>
    </v-col>
    <v-col cols="12" sm="8" md="6">
      <MonthlyView :date="today"/>
    </v-col>
    <v-col cols="12" sm="8" md="6">
      <NextMonthsView :date="today" :n-months="8"/>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import MonthlyView from "~/components/business/MonthlyView";
import NextMonthsView from "~/components/business/NextMonthsView";
import TheDateInput from "~/components/input/TheDateInput";
export default {
  name: 'IndexPage',
  components: {TheDateInput, NextMonthsView, MonthlyView},
  data() {
    return {
        today: moment().subtract(1, 'month').format('y-MM-DD')
    }
  },
  mounted() {
    this.$store.commit('expenses/load')
  }
}
</script>
