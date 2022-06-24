<script lang="ts">
import Vue from "vue";
import { ChannelDto } from "../../common/dto/channel.dto";
import { MessageDto } from "../../common/dto/message.dto";
import { UserDto } from "../../common/dto/user.dto";
import MessageItem from "./MessageItem.vue";
import ChatWindowMenu from "./ChatWindowMenu.vue";

export default Vue.extend({
  props: {
    channel: Object as () => ChannelDto,
    messages: Map,
    users: Map,
  },
  data() {
    return {
      unreadChannels: new Set(),
      unreadMarker: "mdi-new-box",
      messageContent: "",
      itemHeight: 50,
    };
  },
  components: { MessageItem, ChatWindowMenu },
  methods: {
    printResponse(response: string) {
      console.log(`Server: ${response}`);
    },
    sendMessage() {
      this.$socket.client.emit(
        "chat-send",
        {
          channel: this.channel.id,
          message: this.messageContent,
          authorization: this.$store.state.user.token,
        },
        this.printResponse
      );
      this.messageContent = "";
    },
    scrollDown() {
      if (this.channel) {
        let index = (this.messages.get(this.channel.id) as Array<MessageDto>)
          ?.length;
        if (index === undefined) index = 0;
        else index -= 1;
        const scroller = document.getElementById("message-scroll");
        if (scroller) {
          scroller.scrollTop = this.itemHeight * index;
        }
      }
    },
    getUsername(userId: number) {
      const user = this.users.get(userId) as UserDto;
      if (user) {
        return user.username;
      }
      return "UNKNOWN USER";
    },
  },
  computed: {
    lastMessage() {
      const index = (this.messages.get(this.channel.id) as Array<MessageDto>)
        ?.length;
      if (index === undefined) {
        return 0;
      }
      return index - 1;
    },
  },
  mounted() {
    this.scrollDown();
  },
});
</script>

<template>
  <v-card v-if="channel !== undefined">
    <v-container fill-height>
      <v-row dense max-height="10px">
        <v-col cols="11">
          <v-subheader>{{ channel.name }}</v-subheader>
        </v-col>
        <v-col cols="1">
          <chat-window-menu></chat-window-menu>
        </v-col>
      </v-row>
      <v-row dense max-height="5px">
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-virtual-scroll
            :items="messages.get(channel.id)"
            :item-height="itemHeight"
            height="300"
            id="message-scroll"
          >
            <template v-slot:default="{ item }">
              <message-item
                :sender="getUsername(item.senderId)"
                :createdAt="item.createdAt"
                :content="item.content"
              >
              </message-item>
            </template>
          </v-virtual-scroll>
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
