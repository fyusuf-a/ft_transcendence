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
  newMessage: number;
  newUnread: number;
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
      newMessage: 0,
      newUnread: 0,
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
    async handleChannelJoin(channelStr: string) {
      const channelId = parseInt(channelStr);
      console.log("Vue: joining channel " + channelId);
      const channel = this.allChannels.get(channelId);
      if (channel) {
        this.joinChannelById(channelId); // check if it succeeds
        this.subscribedChannels.push(channel);
        this.handleChannelSelection(channel);
      } else {
        // Try to fetch channel ?
        await this.getAllChannels(); // should just get the one channel instead
        if (this.allChannels.has(channelId)) {
          this.handleChannelJoin(channelStr);
        } else {
          console.log("Still can't find the channel :(");
        }
      }
    },
    handleLeaveChannelEvent() {
      if (this.selectedChannel) {
        this.leaveChannelById(this.selectedChannel.id);
      }
    },
    handleChatMessageMenuSelection(event: any) {
      console.log(`Request to ${event.option} ${event.target}`);
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
        !this.selectedChannel ||
        this.selectedChannel.id !== message.channelId
      ) {
        console.log("Message is from inactive channel");
        this.unreadChannels.add(message.channelId);
        this.newUnread += 1;
      } else {
        this.newMessage += 1;
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
    leaveChannelById(id: number) {
      console.log(`Vue: Asking to leave channel #${id}`);
      this.$socket.client.emit(
        "chat-leave",
        { channel: id },
        (response: string) => {
          this.printResponse(response);
        }
      );
      // Remove Channel from subscribed channels, close ChatWindow
      if (this.selectedChannel) {
        const channelIndex = this.subscribedChannels.indexOf(
          this.selectedChannel
        );
        if (channelIndex !== -1) {
          this.subscribedChannels.splice(channelIndex, 1);
        }
      }
      this.selectedChannel = undefined;
    },
    async updateUserWithId() {
      console.log("Vue: Fetching user object");
      let rawResponse = await fetch(
        `http://localhost:8080/users?username=${this.$store.state.user.username}&order=ASC&page=1&take=1`,
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
      this.memberships = response.data;
      if (this.memberships) {
        console.log(this.memberships[0]);
        this.$store.commit("updateUserId", this.memberships[0].id);
      }
    },
    async fetchMemberships() {
      console.log("Vue: Fetching memberships");
      let rawResponse = await fetch(
        `http://localhost:8080/memberships?user=${this.$store.state.userId}`,
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
    // async createMembership(channelId: number): Promise<boolean> {
    //   console.log("Vue: Fetching memberships to create");
    //   let rawResponse = await fetch(
    //     "http://localhost:8080/memberships?user=1",
    //     {
    //       method: "POST",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         Authorization: `bearer ${this.$store.state.user.token}`,
    //       },
    //       body: JSON.stringify({
    //         channelId: channelId,
    //         userId: this.$store.state.userId,
    //         role: "participant",
    //       }),
    //     }
    //   );
    //   return rawResponse.status === 201;
    // },
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
      this.newUnread += 1;
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
    await this.updateUserWithId();
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
          @chat-leave-channel="handleLeaveChannelEvent"
          @chat-message-menu-selection="handleChatMessageMenuSelection"
        ></chat-window>
      </v-col>
      <v-col cols="12" md="2">
        <channels-list
          @channel-select-event="handleChannelSelection"
          @channel-join-event="(channelId) => handleChannelJoin(channelId)"
          title="Channels"
          :channels="subscribedChannels"
          :unreadChannels="unreadChannels"
          :allChannels="allChannels"
          :key="newUnread"
        ></channels-list>
      </v-col>
    </v-row>
  </v-container>
</template>
