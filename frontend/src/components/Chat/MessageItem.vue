<script lang="ts">
import Vue from "vue";
import ChatMessageMenu from "./ChatMessageMenu.vue";

export default Vue.extend({
  props: {
    sender: String,
    senderId: Number,
    createdAt: String,
    content: String,
  },
  data() {
    return {};
  },
  components: { ChatMessageMenu },
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
  // mounted() {},
});
</script>

<template>
  <v-list-item class="messagesItem">
    <v-list-item-avatar>
      <chat-message-menu :targetId="senderId" @chat-message-menu-selection="$emit('chat-message-menu-selection', $event)">
        <v-img
          max-height="45"
          max-width="45"
          :src="'https://static.generated.photos/vue-static/home/hero/3.png'"
        ></v-img>
      </chat-message-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        v-text="`${sender} -- ${formattedDate}`"
      ></v-list-item-title>
      <v-list-item-subtitle v-text="content"></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
