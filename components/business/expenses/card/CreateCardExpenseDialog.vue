<template>
  <v-dialog :value="show" persistent width="800" @input="handleShow">
    <template #activator="{on}">
      <v-btn v-on="on">Nuevo</v-btn>
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
            <v-col sm="6" cols="12">
              <v-combobox v-model="form.account" :rules="[required]" item-value="id" item-text="title" :items="accounts" required label="Cuenta" return-object />
            </v-col>
            <v-col sm="6" cols="12">
              <v-text-field v-model.number="form.amountArs" :rules="[required]" required type="number" min="0" label="Monto (ARS)" />
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="3" cols="12">
              <TheDateInput v-model="form.period" required label="Período" only-month :clearable="false" />
            </v-col>
            <v-col sm="3" cols="12">
              <TheDateInput v-model="form.date" required label="Fecha" :clearable="false" />
            </v-col>
            <v-col sm="3" cols="12">
              <v-text-field v-model.number="form.feeNumber" :rules="[required]" required type="number" min="1" label="Cuota N°" />
            </v-col>
            <v-col sm="3" cols="12">
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
  data() {
    const clearForm = () => ({
      title: '',
      date: moment().format('YYYY-MM-DD'),
      type: 'manual',
      account: null,
      period: moment().format('YYYY-MM-DD'),
      amountArs: 0,
      feeNumber: 1,
      totalFees: 1,
    })
    return {
      show: false,
      clearForm,
      form: clearForm(),
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
    handleShow() {
      this.show = !this.show
      if (this.show) {
        this.form = this.clearForm()
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
      const periodDate = moment(this.form.period)
      const expense = {
        ...this.form,
        account,
        period: {
          id: periodDate.format('YYYY-MM'),
          date: periodDate.toDate(),
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
