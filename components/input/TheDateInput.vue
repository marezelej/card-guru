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
        v-model="computedDateFormattedMomentjs"
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
      v-model="date"
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
    date: ''
  }),
  computed: {
    modifiableDate: {
      get () {
        return this.value
      },
      set (val) {
        this.change(val)
      }
    },
    computedDateFormattedMomentjs () {
      return this.date ? this.formatDate(this.date) : ''
    }
  },
  mounted() {
    if (this.value) {
      this.date = this.value
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
