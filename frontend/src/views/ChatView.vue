<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10">
        <channel-invite-dialog
          v-model="inviting"
          :selectedChannel="selectedChannel"
          @chat-invite-user="handleUserInvite"
        >

        </channel-invite-dialog>
        <chat-window
          v-if="selectedChannel"
          :channel="selectedChannel"
          :membership="activeMembership"
          :messages="getMessages(selectedChannel.id)"
          :users="users"
          :socket="socket"
          :key="newMessage"
          @chat-leave-channel="handleLeaveChannelEvent"
          @chat-message-menu-selection="handleChatMessageMenuSelection"
          @chat-invite-channel="inviting = true"
        ></chat-window>
      </v-col>
      <v-col cols="12" md="2">
        <channel-list
          @channel-select-event="handleChannelSelection"
          @channel-join-event="handleChannelJoin"
          @channel-create-event="handleChannelCreation"
          @request-user-event="addUserToMap"
          @refresh-channels-event="refreshChannels"
          :channels="subscribedChannels"
          :users="users"
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
import ChannelInviteDialog from '@/components/Chat/ChannelInviteDialog.vue';
import { MessageDto } from '@/common/dto/message.dto';
import { MembershipDto } from '@/common/dto/membership.dto';
import { ChannelDto, CreateChannelDto } from '@/common/dto/channel.dto';
import { UserDto } from '@/common/dto/user.dto';
import { ChannelType, JoinChannelDto } from '@dtos/channels';
import { ListBlockDto } from 'src/dtos/blocks';
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
  activeMembership?: MembershipDto;
  messages: Map<number, Array<MessageDto>>;
  newMessage: number;
  newUnread: number;
  users: Map<number, UserDto>;
  memberships: Array<MembershipDto>;
  blocks: Array<number | undefined>;
  inviting: boolean;
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
      activeMembership: undefined,
      messages: new Map(),
      newMessage: 0,
      newUnread: 0,
      users: new Map(),
      memberships: [],
      blocks: [],
      inviting: false,
    };
  },
  components: {
    'channel-list': ChannelList,
    'chat-window': ChatWindow,
    'channel-invite-dialog': ChannelInviteDialog,
  },
  methods: {
    async createChannel(channelObject: CreateChannelDto): Promise<number> {
      let response = await axios.post('/channels/', {
        name: channelObject.name,
        type: channelObject.type,
        password: channelObject.password,
        userId: this.$store.getters.id,
        userOneId: channelObject.userOneId,
        userTwoId: channelObject.userTwoId,
      });
      if (response.status === 201) {
        console.log(response.data);
        return response.data.id;
      }
      return -1;
    },
    async handleChannelCreation(dto: CreateChannelDto) {
      if (!dto.name || !dto.type) {
        console.log('Invalid channel dto');
      } else {
        const createdChannelId: number = await this.createChannel(dto);
        if (createdChannelId > 0) {
          this.socket.emit(
        'chat-listen',
        (response: string) => {
          this.printResponse(response);
          this.refreshChannels();
        },
      );
        }
      }
    },
    handleUserInvite() {
      this.inviting = false;
      console.log(`Inviting a user to ${this.selectedChannel}`);
    },
    getMessages(channelId: number): MessageDto[] {
      const found = this.messages.get(channelId);
      if (found) return found;
      return [];
    },
    printResponse(response: string) {
      console.log(`Server: ${response}`);
    },
    handleChannelSelection(newChannel: ChannelDto) {
      this.selectedChannel = newChannel;
      if (this.selectedChannel) {
        console.log(`parent says: ${this.selectedChannel.name}`);
        this.unreadChannels.delete(this.selectedChannel.id);
        this.getMessagesForChannel(newChannel.id);
        this.fetchMembership(newChannel.id);
      }
    },
    async handleChannelJoin(channelDto: JoinChannelDto) {
      console.log('Vue: joining channel ' + channelDto.id);
      const channel = this.allChannels.get(channelDto.id);
      if (channel) {
        if (channel.type === ChannelType.PROTECTED) {
          console.log('trying to join protected');
          this.joinChannelById(channelDto.id, channelDto.password); // check if it succeeds
        } else {
          this.joinChannelById(channelDto.id); // check if it succeeds
        }
        this.handleChannelSelection(channel);
      } else {
        // Try to fetch channel ?
        await this.getAllChannels(); // should just get the one channel instead
        if (this.allChannels.has(channelDto.id)) {
          this.handleChannelJoin(channelDto);
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
      let username = this.users.get(+event.target)?.username;
      if (event.option === 'chat-profile-user') {
        if (username) {
          this.$router.push('/profile/' + username);
        }
      } else if (event.option === 'chat-message-user') {
        console.log('messaging user ' + username);
        let dto = new CreateChannelDto(
          'direct' + event.target,
          'direct',
          undefined,
          +this.$store.getters.id,
          +event.target,
        );
        this.handleChannelCreation(dto);
      }
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
        messageDto.channelId &&
        !(this.blocks.includes(messageDto.senderId))
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
    async addUserToMap(userId: number) {
      const newUser: UserDto = await this.fetchUserById(userId);
      if (newUser) {
        console.log(
          `Adding User #${newUser.id} (${newUser.username}) to users`,
        );
        this.users.set(userId, newUser);
      }
      return newUser;
    },
    async addMessageToMap(message: MessageDto) {
      if (!this.users.has(message.senderId)) {
        const newUser: UserDto = await this.addUserToMap(message.senderId);
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
        `/messages?channel=${channelId}&userId=${this.$store.getters.user.id}&order=DESC&page=1&take=10`,
      );
      console.log(response.data.data);
      let newMessages = response.data.data; // data update to axios standard
      if (newMessages) {
        for (let message of newMessages) {
          await this.addMessageToMap(message);
        }
      }
    },
    joinChannelById(id: number, password?: string) {
      console.log(`Vue: Asking to join channel #${id}`);
      const channel = this.allChannels.get(id);
      if (!channel) return;
      this.socket.emit(
        'chat-join',
        { channel: id, password: password },
        (response: string) => {
          this.printResponse(response);
          this.subscribedChannels.push(channel);
        },
      );
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
    async fetchMembership(channelId: number) {
      console.log(
        `Vue: Fetching membership for user ${this.$store.getters.id} on channel ${channelId}`,
      );
      const response = await axios.get(
        `/memberships?channel=${channelId}&user=${this.$store.getters.id}`,
      );
      console.log(response.data);
      this.activeMembership = response.data[0];
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
    async fetchBlocks() {
      const response = await axios.get(
        `/users/${this.$store.getters.id}/blocks`
      );
      console.log(response);
      response.data.forEach((block : ListBlockDto)=> {
        this.blocks.push(block.user.id);
      });
      console.log("blocks: " + this.blocks);
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
    async refreshChannels() {
      this.allChannels.clear();
      this.subscribedChannels = [];
      this.blocks = [];
      await this.getAllChannels();
      await this.fetchMemberships();
      await this.fetchBlocks();
      console.log('Trying to match membership to channel');
      for (let membership of this.memberships) {
        console.log('Checking membership' + membership);
        const channel = this.allChannels.get(membership.channelId);
        if (channel) {
          console.log('Matched membership to channel');
          this.subscribedChannels.push(channel);
        } else {
          console.log("Couldn't match membership to channel");
          // try to get channel and try again?
        }
      }
    }
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
    this.socket.emit('auth', {
      id: this.$store.getters.id,
      token: this.$store.getters.token,
    });
    this.socket.emit(
        'chat-listen',
        (response: string) => {
          this.printResponse(response);
        },
      );
      this.refreshChannels();
    this.socket.on('chat-message', this.handleMessage);
  },
  beforeDestroy() {
    this.socket.off('chat-message', this.handleMessage);
  },
});
</script>

<style>
  .button {
    cursor: pointer;
  }
</style>