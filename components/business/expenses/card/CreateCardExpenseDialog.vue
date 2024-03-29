<template>
  <v-dialog :value="show" persistent width="800" @input="handleShow">
    <template #activator="{on}">
      <slot name="activator" v-bind="{on}">
        <v-btn v-on="on">Nuevo</v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>Nuevo gasto de tarjeta</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col>
              <v-text-field v-model="form.title" :rules="[required]" autofocus required label="Título" />
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="4" cols="12">
              <v-combobox v-model="form.account" :rules="[required]" item-value="id" item-text="title" :items="accounts" required label="Cuenta" return-object />
            </v-col>
            <v-col sm="4" cols="12">
              <v-text-field v-model.number="form.amountArs" :rules="[required]" required type="number" min="0" label="Monto (ARS)" />
            </v-col>
            <v-col sm="4" cols="12">
              <TheDateInput v-model="form.expirationDate" label="Vencimiento" :clearable="false" />
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="3" cols="6">
              <TheDateInput v-model="form.period" label="Período" only-month :clearable="false" />
            </v-col>
            <v-col sm="3" cols="6">
              <TheDateInput v-model="form.date" label="Fecha" :clearable="false" />
            </v-col>
            <v-col sm="3" cols="6">
              <v-text-field v-model.number="form.feeNumber" :rules="[required]" required type="number" min="1" label="Cuota N°" />
            </v-col>
            <v-col sm="3" cols="6">
              <v-text-field v-model.number="form.totalFees" :rules="[required]" required type="number" min="1" label="N° total de cuotas" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-btn color="danger" @click="show = false">Cancelar</v-btn>
        <v-btn color="success" @click="clickSave">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import {isString} from "lodash";
import TheDateInput from "~/components/input/TheDateInput";
export default {
  name: "CreateCardExpenseModal",
  components: {TheDateInput},
  props: {
    duplicate: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      show: false,
      form: this.cleanForm(),
      required: val => !!val || 'Campo obligatorio'
    }
  },
  computed: {
    accounts() {
      const accounts = {}
      this.$store.state.expenses.cardList.forEach(e => {
        accounts[e.account.id] = e.account
      })
      return Object.values(accounts)
    },
    periods() {
      if (!this.form.account) {
        return []
      }
      const periods = {}
      this.$store.state.expenses.cardList.forEach(e => {
        if (e.account.id === this.form.account.id) {
          periods[e.period.id] = e.period
        }
      })
      return Object.values(periods)
    }
  },
  methods: {
    cleanForm() {
      const dateFormat = 'YYYY-MM-DD'
      if (this.duplicate !== null) {
        return {
          ...this.duplicate,
          date: moment(this.duplicate.date).format(dateFormat),
          period: moment(this.duplicate.period.date).format(dateFormat),
          expirationDate: moment(this.duplicate.period.expirationDate).format(dateFormat),
        }
      }
      return {
        title: '',
        date: moment().format(dateFormat),
        type: 'manual',
        account: null,
        period: moment().format(dateFormat),
        expirationDate: moment().format(dateFormat),
        amountArs: 0,
        feeNumber: 1,
        totalFees: 1,
      }
    },
    handleShow() {
      this.show = !this.show
      if (this.show) {
        this.form = this.cleanForm()
      }
    },
    clickSave() {
      if (!this.$refs.form.validate()) {
        return
      }
      let account = this.form.account
      if (isString(account)) {
        account = {
          id: 'MANUAL-' + account,
          title: account,
          color: 'secondary'
        }
      }
      const expense = {
        ...this.form,
        account,
        period: {
          id: moment(this.form.period).format('YYYY-MM'),
          date: moment(this.form.period).toDate(),
          expirationDate: moment(this.form.expirationDate).toDate(),
          minArs: 0
        }
      }
      this.$store.commit('expenses/addCard', [expense])
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>
