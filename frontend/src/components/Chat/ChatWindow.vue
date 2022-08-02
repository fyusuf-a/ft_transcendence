<template>
  <v-card v-if="channel !== undefined">
    <v-container fill-height>
      <v-row dense max-height="10px">
        <v-col cols="11">
          {{ channel.name }}
        </v-col>
        <v-col cols="1">
          <chat-window-menu
            @chat-leave-channel="handleLeaveChannelEvent"
          ></chat-window-menu>
        </v-col>
      </v-row>
      <v-row dense max-height="5px">
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row v-for="item in messages.get(channel.id)">
        <v-col cols="12">
              <chat-message
                :sender="getUsername(item.senderId)"
                :senderId="item.senderId"
                :createdAt="item.createdAt"
                :content="item.content"
                @chat-message-menu-selection="
                  $emit('chat-message-menu-selection', $event)
                "
              >
              </chat-message>
        </v-col>
      </v-row>

      <v-row align="baseline">
        <v-col class="col-10">
          <v-text-field
            v-model="messageContent"
            label="Message"
            outlined
            clearable
            @keyup.enter="sendMessage"
          ></v-text-field>
        </v-col>
        <v-col class="col-2">
          <v-btn depressed color="primary" @click="sendMessage"> Send </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ChatMessage from '@/components/Chat/ChatMessage.vue';
import ChatWindowMenu from '@/components/Chat/ChatWindowMenu.vue';
import { ChannelDto } from '@/common/dto/channel.dto';
import { MessageDto } from '@/common/dto/message.dto';
import { UserDto } from '@/common/dto/user.dto';

interface DataReturnType {
  messageContent: string;
  itemHeight: number;
}

export default Vue.extend({
  props: {
    channel: {
      type: Object as PropType<ChannelDto>,
      required: true,
    },
    messages: {
      type: Map,
      required: true,
    },
    users: {
      type: Map,
      required: true,
    },
    socket: {
      type: Object,
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
    printResponse(response: string) {
      console.log(`Server: ${response}`);
    },
    sendMessage() {
      this.socket.emit('chat-send', {
        channel: this.channel.id,
        message: this.messageContent,
        authorization: this.$store.getters.token,
      });
      this.messageContent = '';
    },
    scrollDown() {
      if (this.channel) {
        let index = (this.messages.get(this.channel.id) as Array<MessageDto>)
          ?.length;
        if (index === undefined) index = 0;
        else index -= 1;
        const scroller = document.getElementById('message-scroll');
        if (scroller) {
          scroller.scrollTop = this.itemHeight * index;
        }
      }
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
  },
  computed: {},
  mounted() {
    this.scrollDown();
  },
});
</script>
