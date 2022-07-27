<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10">
        <chat-window
          v-if="selectedChannel"
          :channel="selectedChannel"
          :messages="messages"
          :users="users"
          :socket="socket"
          :key="newMessage"
          @chat-leave-channel="handleLeaveChannelEvent"
          @chat-message-menu-selection="handleChatMessageMenuSelection"
        ></chat-window>
      </v-col>
      <v-col cols="12" md="2">
        <channel-list
          @channel-select-event="handleChannelSelection"
          @channel-join-event="handleChannelJoin"
          title="Channels"
          :channels="subscribedChannels"
          :unreadChannels="unreadChannels"
          :allChannels="allChannels"
          :key="newUnread"
        ></channel-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import ChannelList from '@/components/Chat/ChannelList.vue';
import ChatWindow from '@/components/Chat/ChatWindow.vue';
import { MessageDto } from '@/common/dto/message.dto';
import { MembershipDto } from '@/common/dto/membership.dto';
import { ChannelDto } from '@/common/dto/channel.dto';
import { UserDto } from '@/common/dto/user.dto';

interface MenuSelectionEvent {
  option: string;
  target: string;
}
interface DataReturnType {
  socket: Socket;
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
export default defineComponent({
  data(): DataReturnType {
    return {
      socket: io(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${
          import.meta.env.VITE_BACKEND_PORT
        }/chat`,
      ),
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
  components: {
    'channel-list': ChannelList,
    'chat-window': ChatWindow,
  },
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
      console.log('Vue: joining channel ' + channelId);
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
    handleChatMessageMenuSelection(event: MenuSelectionEvent) {
      console.log(`Request to ${event.option} ${event.target}`);
    },
    handleMessage(messageDto: MessageDto) {
      console.log('Vue: incoming...');
      console.log(messageDto);
      console.log(
        `Vue: Message from [${messageDto.senderId}] to [${messageDto.channelId}]: ${messageDto.content}`,
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
      message?: MessageDto,
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
            `Adding User #${newUser.id} (${newUser.username}) to users`,
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
        console.log('Message is from inactive channel');
        this.unreadChannels.add(message.channelId);
        this.newUnread += 1;
      } else {
        this.newMessage += 1;
      }
    },
    async fetchUserById(userId: number) {
      console.log(`Vue: Grabbing user #${userId}`);
      const response = await axios.get(`/users/${userId}`);
      console.log(response.data);
      if (response.data) {
        // possibly wrong, update for axios
        return response.data;
      } else {
        return { id: -1, username: 'Unknown User' };
      }
    },
    async getMessagesForChannel(channelId: number) {
      console.log(`Vue: Grabbing messages on channel ${channelId}`);
      const response = await axios.get(
        `/messages?channel=${channelId}&order=DESC&page=1&take=10`,
      );
      console.log(response.data.data);
      let newMessages = response.data.data; // data update to axios standard
      if (newMessages) {
        for (let message of newMessages) {
          await this.addMessageToMap(message);
        }
      }
    },
    joinChannelById(id: number) {
      console.log(`Vue: Asking to join channel #${id}`);
      this.socket.emit('chat-join', { channel: id }, (response: string) => {
        this.printResponse(response);
      });
    },
    leaveChannelById(id: number) {
      console.log(`Vue: Asking to leave channel #${id}`);
      this.socket.emit('chat-leave', { channel: id }, (response: string) => {
        this.printResponse(response);
      });
      // Remove Channel from subscribed channels, close ChatWindow
      if (this.selectedChannel) {
        const channelIndex = this.subscribedChannels.indexOf(
          this.selectedChannel,
        );
        if (channelIndex !== -1) {
          this.subscribedChannels.splice(channelIndex, 1);
        }
      }
      this.selectedChannel = undefined;
    },
    async fetchMemberships() {
      console.log(
        `Vue: Fetching memberships for user ${this.$store.getters.id}`,
      );
      const response = await axios.get(
        `/memberships?user=${this.$store.getters.id}`,
      );
      console.log(response.data);
      this.memberships = response.data;
      if (this.memberships) {
        for (let membership of this.memberships) {
          console.log(membership);
        }
      }
    },
    async getAllChannels() {
      console.log('Vue: Grabbing channels');
      const response = await axios.get('/channels/');
      console.log(response.data);
      const channels = response.data.data; // possible wrong key, try data.channels if necessary
      if (channels) {
        for (let channel of channels) {
          console.log(`Adding channel ${channel.id} to allChannels`);
          this.allChannels.set(channel.id, channel);
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
  async created() {
    this.socket.emit('chat-auth', { authorization: this.$store.getters.token });
    await this.getAllChannels();
    await this.fetchMemberships();
    console.log('Trying to match membership to channel');
    for (let membership of this.memberships) {
      console.log('Checking membership' + membership);
      const channel = this.allChannels.get(membership.channelId);
      if (channel) {
        console.log('Matched membership to channel');
        this.subscribedChannels.push(channel);
        this.joinChannelById(channel.id);
      } else {
        console.log("Couldn't match membership to channel");
        // try to get channel and try again?
      }
    }
    this.socket.on('chat-message', this.handleMessage);
  },
  beforeDestroy() {
    this.socket.off('chat-message', this.handleMessage);
  },
});
</script>
