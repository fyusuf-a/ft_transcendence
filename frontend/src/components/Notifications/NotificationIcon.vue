<template>
  <v-btn icon @click="emitClick">
    <v-icon v-if="alert" color="accent">mdi-bell</v-icon>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    alert: {
      type: Boolean,
      required: true,
    },
  },
  event: ["click"],
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
};
</script>
