<template>
  <v-card v-if="channel !== undefined && membership !== undefined">
    <v-toolbar color="primary" density="compact">
      <v-toolbar-title>{{ getChannelDisplay(channel) }}</v-toolbar-title>
      <chat-window-menu
        :channel="channel"
        :membership="membership"
        @chat-leave-channel="handleLeaveChannelEvent"
        @chat-invite-channel="$emit('chat-invite-channel')"
        @chat-change-password="$emit('chat-change-password')"
      ></chat-window-menu>
    </v-toolbar>
    <v-card fill-height>
      <v-row v-for="item in messages" :key="item.id">
        <v-col cols="12">
          <chat-message
            :sender="getUsername(item.senderId)"
            :senderId="item.senderId"
            :createdAt="item.createdAt"
            :content="item.content"
            :membership-role="membership.role"
            @chat-message-menu-selection="
              $emit('chat-message-menu-selection', $event)
            "
          >
          </chat-message>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10">
          <v-text-field
            v-model="messageContent"
            label="Message"
            clearable
            density="compact"
            @keyup.enter="sendMessage"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn depressed color="primary" @click="sendMessage"> Send </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ChatMessage from '@/components/Chat/ChatMessage.vue';
import ChatWindowMenu from '@/components/Chat/ChatWindowMenu.vue';
import { ChannelDto } from '@/common/dto/channel.dto';
import { MessageDto } from '@/common/dto/message.dto';
import { UserDto } from '@/common/dto/user.dto';
import { MembershipDto } from '@/common/dto/membership.dto';
import { chatStore } from '@/store/chat';

interface DataReturnType {
  messageContent: string;
  itemHeight: number;
}

export default defineComponent({
  props: {
    channel: {
      type: Object as PropType<ChannelDto>,
      required: true,
    },
    membership: {
      type: Object as PropType<MembershipDto>,
      required: false,
    },
    messages: {
      type: Object as PropType<MessageDto[]>,
      required: true,
    },
    users: {
      type: Map,
      required: true,
    },
  },
  data(): DataReturnType {
    return {
      messageContent: '',
      itemHeight: 50,
    };
  },
  components: {
    'chat-message': ChatMessage,
    'chat-window-menu': ChatWindowMenu,
  },
  methods: {
    sendMessage() {
      chatStore.state.socket?.emit('chat-send', {
        channel: this.channel.id,
        message: this.messageContent,
        authorization: this.$store.getters.token,
      });
      this.messageContent = '';
    },
    getUsername(userId: number): string {
      const user = this.users.get(userId) as UserDto;
      if (user) {
        return user.username;
      }
      return 'UNKNOWN USER';
    },
    handleLeaveChannelEvent() {
      this.$emit('chat-leave-channel');
    },
    getChannelDisplay(channel: ChannelDto): string {
      if (channel.type !== 'direct') return channel.name;
      else if (
        channel.type === 'direct' &&
        this.$store.getters.id !== channel.userOneId
      )
        return this.getUsername(channel.userOneId as number);
      else if (
        channel.type === 'direct' &&
        this.$store.getters.id !== channel.userTwoId
      )
        return this.getUsername(channel.userTwoId as number);
      return '...';
    },
  },
  created() {
    chatStore.state.socket?.emit('chat-listen');
  },
});
</script>
