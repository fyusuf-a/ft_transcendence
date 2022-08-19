<template>
  <v-btn icon @click="reverseAlert">
    <v-icon v-if="alert" color="accent">mdi-bell</v-icon>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      alert: false,
    };
  },
  methods: {
    reverseAlert() {
      this.alert = !this.alert;
    },
  },
});
</script>
