<script lang="ts">
import { ChannelDto } from "../common/dto/channel.dto";
import Vue from "vue";
import ChannelsList from "../components/Chat/ChannelsList.vue";
import ChatWindow from "../components/Chat/ChatWindow.vue";
import { MessageDto } from "../common/dto/message.dto";
import { MembershipDto } from "../common/dto/membership.dto";
import { UserDto } from "../common/dto/user.dto";

declare interface DataType {
  channels: Array<ChannelDto>;
  allChannels: Map<number, ChannelDto>;
  subscribedChannels: Array<ChannelDto>;
  unreadChannels: Set<number>;
  selectedChannel?: ChannelDto;
  messages: Map<number, Array<MessageDto>>;
  newMessage: string;
  newUnread: string;
  users: Map<number, UserDto>;
  memberships: Array<MembershipDto>;
}

export default Vue.extend({
  data(): DataType {
    return {
      channels: [],
      allChannels: new Map(),
      subscribedChannels: [],
      unreadChannels: new Set(),
      selectedChannel: undefined,
      messages: new Map(),
      newMessage: "message-new-",
      newUnread: "unread-channel-",
      users: new Map(),
      memberships: [],
    };
  },
  components: { ChannelsList, ChatWindow },
  methods: {
    printResponse(response: string) {
      console.log(`Server: ${response}`);
    },
    handleChannelSelection(newChannel: ChannelDto) {
      this.selectedChannel = newChannel;
      if (this.selectedChannel) {
        console.log(`parent says: ${this.selectedChannel.name}`);
        this.unreadChannels.delete(this.selectedChannel.id);
        this.getMessagesForChannel(newChannel.id);
      }
    },
    handleMessage(messageDto: MessageDto) {
      console.log("Vue: incoming...");
      console.log(messageDto);
      console.log(
        `Vue: Message from [${messageDto.senderId}] to [${messageDto.channelId}]: ${messageDto.content}`
      );
      if (
        messageDto &&
        messageDto.senderId &&
        messageDto.content &&
        messageDto.channelId
      ) {
        this.addMessageToMap(messageDto);
      }
    },
    insertMessageSorted(
      messageArray?: Array<MessageDto>,
      message?: MessageDto
    ) {
      if (!messageArray || !message) {
        return;
      }
      if (message.createdAt > messageArray[messageArray.length - 1].createdAt) {
        messageArray.push(message);
      } else {
        for (let i = 0; i < messageArray.length; ++i) {
          if (message.createdAt === messageArray[i].createdAt) {
            if (message.id === messageArray[i].id) {
              break;
            }
          } else if (message.createdAt < messageArray[i].createdAt) {
            messageArray.splice(i, 0, message);
            break;
          }
        }
      }
    },
    async addMessageToMap(message: MessageDto) {
      if (!this.users.has(message.senderId)) {
        const newUser: UserDto = await this.fetchUserById(message.senderId);
        if (newUser) {
          console.log(
            `Adding User #${newUser.id} (${newUser.username}) to users`
          );
          this.users.set(message.senderId, newUser);
        }
      }
      if (this.messages.has(message.channelId)) {
        this.insertMessageSorted(this.messages.get(message.channelId), message);
      } else {
        this.messages.set(message.channelId, [message]);
      }
      this.messages = new Map(this.messages);
      if (
        this.selectedChannel &&
        this.selectedChannel.id !== message.channelId
      ) {
        console.log("Message is from inactive channel");
        this.unreadChannels.add(message.channelId);
        this.newUnread += "1";
      } else {
        this.newMessage += "1";
      }
    },
    async fetchUserById(userId: number) {
      console.log(`Vue: Grabbing user #${userId}`);
      let rawResponse = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${this.$store.state.user.token}`,
        },
      });
      const response = await rawResponse.json();
      if (response) {
        return response;
      } else {
        return { id: -1, username: "Unknown User" };
      }
    },
    async getMessagesForChannel(channelId: number) {
      console.log(`Vue: Grabbing messages on channel ${channelId}`);
      let rawResponse = await fetch(
        `http://localhost:8080/messages?channel=${channelId}&order=DESC&page=1&take=10`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${this.$store.state.user.token}`,
          },
        }
      );
      const response = await rawResponse.json();
      let newMessages = response.data;
      if (newMessages) {
        for (let message of newMessages) {
          await this.addMessageToMap(message);
        }
      }
    },
    joinChannelById(id: number) {
      console.log(`Vue: Asking to join channel #${id}`);
      this.$socket.client.emit(
        "chat-join",
        { channel: id },
        (response: string) => {
          this.printResponse(response);
        }
      );
    },
    async fetchMemberships() {
      console.log("Vue: Fetching memberships");
      let rawResponse = await fetch(
        "http://localhost:8080/memberships?user=1",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${this.$store.state.user.token}`,
          },
        }
      );
      const response = await rawResponse.json();
      this.memberships = response;
      if (this.memberships) {
        for (let membership of this.memberships) {
          console.log(membership);
        }
      }
    },
    async getAllChannels() {
      console.log("Vue: Grabbing channels");
      let rawResponse = await fetch("http://localhost:8080/channels", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${this.$store.state.user.token}`,
        },
      });
      const response = await rawResponse.json();
      const channels = response.data;
      if (channels) {
        for (let channel of channels) {
          this.allChannels.set(channel.id, channel);
          // this.joinChannelById(channel.id);
        }
      }
    },
  },
  computed: {
    messageInSelectedChannel(): MessageDto[] {
      const selectedId = this.selectedChannel?.id;
      if (selectedId) {
        let messageArray = this.messages.get(selectedId);
        if (messageArray) {
          return messageArray;
        }
      }
      return [];
    },
  },
  async mounted() {
    await this.getAllChannels();
    await this.fetchMemberships();
    console.log("Trying to match membership to channel");
    for (let membership of this.memberships) {
      console.log("Checking membership" + membership);
      const channel = this.allChannels.get(membership.channelId);
      if (channel) {
        console.log("Matched membership to channel");
        this.subscribedChannels.push(channel);
        this.joinChannelById(channel.id);
      } else {
        console.log("Couldn't match membership to channel");
        // try to get channel and try again?
      }
    }

    this.$socket.client.on("chat-message", this.handleMessage);
  },
  beforeDestroy() {
    this.$socket.client.off("chat-message", this.handleMessage);
  },
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10">
        <chat-window
          :channel="selectedChannel"
          :messages="messages"
          :users="users"
          :key="newMessage"
        ></chat-window>
      </v-col>
      <v-col cols="12" md="2">
        <channels-list
          @channel-select-event="handleChannelSelection"
          title="Channels"
          :channels="subscribedChannels"
          :unreadChannels="unreadChannels"
          :key="newUnread"
        ></channels-list>
      </v-col>
    </v-row>
  </v-container>
</template>
