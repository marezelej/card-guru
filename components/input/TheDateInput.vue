<template>
  <v-menu
    ref="menu"
    v-model="showMenu"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on }">
      <TheTextInput
        :value="formattedDate"
        :label="label"
        :placeholder="placeholder"
        :rules="rules"
        prepend-inner-icon="mdi-calendar"
        hide-counter
        readonly
        :disabled="readonly"
        :clearable="clearable"
        :hide-details="hideDetails"
        @input="change"
        @click:clear="clear"
        v-on="on"
      />
    </template>
    <v-date-picker
      :value="value"
      :min="minDate || ''"
      :max="maxDate || ''"
      no-title
      scrollable
      :readonly="readonly"
      :type="onlyMonth ? 'month' : 'date'"
      @input="change"
      @change="change"
    />
  </v-menu>
</template>

<script>
import moment from "moment";
import FormatDateMixin from '~/mixins/common/FormatDateMixin'
import TheTextInput from "~/components/input/TheTextInput";
export default {
  components: {TheTextInput},
  mixins: [FormatDateMixin],
  props: {
    maxDate: {
      type: String,
      default: null
    },
    minDate: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    rules: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: () => ''
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    onlyMonth: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showMenu: false,
  }),
  computed: {
    formattedDate () {
      if (!this.value) {
        return ''
      }
      const format = this.onlyMonth? 'YYYY/MM' : 'YYYY/MM/DD'
      return moment(this.value).format(format)
    }
  },
  methods: {
    clear () {
      this.$emit('input', null)
    },
    change (val) {
      this.$emit('input', val)
    }
  }
}
</script>
