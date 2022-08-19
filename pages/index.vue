<template>
  <v-row justify="center">
    <v-col cols="12">
      <TheMonthSelector v-model="today" />
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
import TheMonthSelector from "~/components/input/TheMonthSelector";
export default {
  name: 'IndexPage',
  components: {TheMonthSelector, NextMonthsView, MonthlyView},
  data() {
    return {
        today: moment().format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.$store.commit('expenses/load')
  }
}
</script>
