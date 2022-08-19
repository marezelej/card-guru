<template>
  <v-menu
    ref="menu"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on }">
      <TheTextInput
        prepend-icon="mdi-arrow-left"
        append-outer-icon="mdi-arrow-right"
        hide-counter
        readonly
        :value="formattedDate"
        @click:prepend="moveMonth(-1)"
        @click:append-outer="moveMonth(1)"
        @input="change"
        v-on="on"
      />
    </template>
    <v-date-picker
      :value="value"
      no-title
      scrollable
      type="month"
      @input="change"
      @change="change"
    />
  </v-menu>
</template>

<script>
import moment from "moment";
import TheTextInput from "~/components/input/TheTextInput";
export default {
  name: "TheMonthSelector",
  components: {TheTextInput},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    formattedDate() {
      if (!this.value) {
        return ''
      }
      return moment(this.value).format('YYYY/MM')
    }
  },
  methods: {
    moveMonth(months) {
      const current = moment(this.value)
      current.add(months, 'months')
      this.$emit('input', current.format('y-MM-DD'))
    },
    change(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
