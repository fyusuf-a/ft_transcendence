<template>
  <v-list-item class="messageItem">
    
      <chat-message-menu
        :targetId="senderId"
        @chat-message-menu-selection="
          $emit('chat-message-menu-selection', $event)
        "
      >
        <v-img max-height="45" max-width="45" :src="avatar"> </v-img>
      </chat-message-menu>
    
      <v-list-item-title
        v-text="`${sender} -- ${formattedDate}`"
      ></v-list-item-title><br>
      <v-list-item-subtitle>
        {{ content }}
      </v-list-item-subtitle>
  </v-list-item>
</template>

<script lang="ts">
import ChatMessageMenu from './ChatMessageMenu.vue';
import { defineComponent } from 'vue';

export default defineComponent({
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
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      avatar: '',
    };
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
  async created() {
    this.avatar = await this.$store.dispatch(
      'getAvatarById',
      this.senderId.toString(),
    );
  },
});
</script>
