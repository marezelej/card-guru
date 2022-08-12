<template>
  <v-form>
    <v-row>
      <v-col>
        <v-btn @click="moveMonth(-1)">Anterior</v-btn>
      </v-col>
      <v-col cols="8">
        <TheDateInput only-month :value="value" :clearable="false" @input="v => $emit('input', v)" />
      </v-col>
      <v-col class="text-right">
        <v-btn @click="moveMonth(1)">Siguiente</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import moment from "moment";
import TheDateInput from "~/components/input/TheDateInput";
export default {
  name: "TheMonthSelector",
  components: {TheDateInput},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    moveMonth(months) {
      const current = moment(this.value)
      current.add(months, 'months')
      this.$emit('input', current.format('y-MM-DD'))
    }
  }
}
</script>

<style scoped>

</style>
