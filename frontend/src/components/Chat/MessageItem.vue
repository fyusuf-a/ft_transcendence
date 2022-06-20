<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    sender: String,
    createdAt: String,
    content: String,
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    formattedDate(): string {
      const date: Date = new Date(this.createdAt);
      return date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    },
  },
  mounted() {},
});
</script>

<template>
  <v-list-item class="messagesItem">
    <v-list-item-avatar>
      <v-img
        max-height="45"
        max-width="45"
        :src="'https://static.generated.photos/vue-static/home/hero/3.png'"
      ></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        v-text="`${sender} -- ${formattedDate}`"
      ></v-list-item-title>
      <v-list-item-subtitle v-text="content"></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
