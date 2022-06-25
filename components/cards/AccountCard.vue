<template>
  <v-card v-bind="$attrs" :color="account.color">
    <v-card-title class="pb-0">
      {{ account.title }}
    </v-card-title>
    <v-card-text>
      <div class="mx-0 text-subtitle-2">
        AR$ {{ account.totalArs.toFixed(2) }} / % {{ account.quote.toFixed(2) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      required: true
    }
  },
}
</script>
