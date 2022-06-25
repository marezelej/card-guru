<template>
  <v-card v-bind="$attrs" :color="color">
    <v-card-title class="pb-0">
      {{ title }}
    </v-card-title>
    <v-card-text>
      <div class="mx-0 text-subtitle-2">
        <slot/>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
}
</script>
