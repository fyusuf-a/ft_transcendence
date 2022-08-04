<template>
  <v-list-item class="messageItem">
    <v-list-item-avatar>
      <chat-message-menu
        :targetId="senderId"
        @chat-message-menu-selection="
          $emit('chat-message-menu-selection', $event)
        "
      >
        <v-img
          max-height="45"
          max-width="45"
          :src="'https://static.generated.photos/vue-static/home/hero/3.png'"
        >
        </v-img>
      </chat-message-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        v-text="`${sender} -- ${formattedDate}`"
      ></v-list-item-title>
      <v-list-item-subtitle>
        {{ content }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import ChatMessageMenu from './ChatMessageMenu.vue';
import Vue from 'vue';

export default Vue.extend({
  props: {
    sender: {
      type: String,
      required: true,
    },
    senderId: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  components: {
    'chat-message-menu': ChatMessageMenu,
  },
  methods: {},
  computed: {
    formattedDate(): string {
      const date: Date = new Date(this.createdAt);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    },
  },
});
</script>
