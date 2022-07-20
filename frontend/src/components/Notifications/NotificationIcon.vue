<template>
  <v-btn icon @click="emitClick">
    <v-icon v-if="alert" color="accent">mdi-bell</v-icon>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    alert: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    emitClick() {
      this.$emit('click');
    },
  },
});
</script>
