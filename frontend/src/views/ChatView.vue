<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <channel-list
          @channel-select-event="handleChannelSelection"
          @channel-join-event="handleChannelJoin"
          @channel-create-event="handleChannelCreation"
          @request-user-event="addUserToMap"
          @refresh-channels-event="refreshChannels"
          @chat-dm-user="dming = true"
          :channels="subscribedChannels"
          :users="users"
          :unreadChannels="unreadChannels"
          :allChannels="allChannels"
          :key="newUnread"
        ></channel-list>
      </v-col>
      <v-col cols="12" md="9">
        <chat-dm-dialog v-model="dming" @chat-dm-user="handleDmUser">
        </chat-dm-dialog>
        <channel-invite-dialog
          v-model="inviting"
          :selectedChannel="selectedChannel"
          @chat-invite-user="handleUserInvite"
        >
        </channel-invite-dialog>
        <channel-password-dialog
          v-model="changePass"
          :selectedChannel="selectedChannel"
        >
        </channel-password-dialog>
        <channel-karma-dialog
          v-model="karma"
          :selected-channel="selectedChannel"
          :selected-user="selectedUserId"
          :socket="socket"
        >
        </channel-karma-dialog>
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
          @chat-change-password="changePass = true"
        ></chat-window>
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
import { ListBlockDto } from '@dtos/blocks';
import { MembershipRoleType } from '@dtos/memberships';
import ChannelPasswordDialogVue from '@/components/Chat/ChannelPasswordDialog.vue';
import ChannelKarmaDialogVue from '@/components/Chat/ChannelKarmaDialog.vue';
import ChatDmDialogVue from '@/components/Chat/ChatDmDialog.vue';
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
  selectedUserId?: number;
  activeMembership?: MembershipDto;
  messages: Map<number, Array<MessageDto>>;
  newMessage: number;
  newUnread: number;
  users: Map<number, UserDto>;
  memberships: Array<MembershipDto>;
  blocks: Array<number | undefined>;
  inviting: boolean;
  changePass: boolean;
  karma: string;
  dming: boolean;
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
      selectedUserId: -1,
      activeMembership: undefined,
      messages: new Map(),
      newMessage: 0,
      newUnread: 0,
      users: new Map(),
      memberships: [],
      blocks: [],
      inviting: false,
      changePass: false,
      karma: '',
      dming: false,
    };
  },
  components: {
    'channel-list': ChannelList,
    'chat-window': ChatWindow,
    'channel-invite-dialog': ChannelInviteDialog,
    'channel-password-dialog': ChannelPasswordDialogVue,
    'channel-karma-dialog': ChannelKarmaDialogVue,
    'chat-dm-dialog': ChatDmDialogVue,
  },
  methods: {
    async createChannel(channelObject: CreateChannelDto): Promise<number> {
      return axios
        .post('/channels/', {
          name: channelObject.name,
          type: channelObject.type,
          password: channelObject.password,
          userId: this.$store.getters.id,
          userOneId: channelObject.userOneId,
          userTwoId: channelObject.userTwoId,
        })
        .then((response) => {
          if (response.status === 201) {
            return response.data.id;
          }
        })
        .catch(() => {
          window.alert(`Could not create channel "${channelObject.name}"`);
          return -1;
        });
    },
    async handleChannelCreation(dto: CreateChannelDto) {
      this.selectedChannel = undefined;
      if (!dto.name || !dto.type) {
        console.log('Invalid channel dto');
      } else {
        const createdChannelId: number = await this.createChannel(dto);
        if (createdChannelId > 0) {
          axios
            .get('/channels/' + createdChannelId)
            .then((response) => {
              this.handleChannelSelection(response.data);
            })
            .catch(() => console.log('Could not find channel'));
        }
      }
    },
    async handleUserInvite(userId: number): Promise<number> {
      this.inviting = false;
      if (!this.selectedChannel?.id) {
        return Promise.resolve(-1);
      }
      return axios
        .post('/memberships/', {
          userId: userId,
          channelId: this.selectedChannel.id,
          role: MembershipRoleType.PARTICIPANT,
        })
        .then((response): number => {
          if (response.status === 201) {
            this.alert(
              `The user was added to ${this.selectedChannel?.name}. Say hello!`,
            );
            return response.data.id;
          }
          return -1;
        })
        .catch((): number => {
          this.alert('Could not add user to channel!');
          return -1;
        });
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
        this.unreadChannels.delete(this.selectedChannel.id);
        this.fetchMembership(newChannel.id);
        this.getMessagesForChannel(newChannel.id);
      }
    },
    async handleChannelJoin(channelDto: JoinChannelDto) {
      const channel = this.allChannels.get(channelDto.id);
      if (channel) {
        if (channel.type === ChannelType.PROTECTED) {
          await this.joinChannelById(channelDto.id, channelDto.password);
        } else {
          await this.joinChannelById(channelDto.id);
        }
        this.handleChannelSelection(channel);
      } else {
        await this.getAllChannels();
        if (this.allChannels.has(channelDto.id)) {
          this.handleChannelJoin(channelDto);
        }
      }
    },
    handleLeaveChannelEvent() {
      if (this.selectedChannel) {
        this.leaveChannelById(this.selectedChannel.id);
      }
    },
    async handleChatMessageMenuSelection(event: MenuSelectionEvent) {
      if (!event.target) return;
      let username = this.users.get(+event.target)?.username;
      if (event.option === 'chat-profile-user') {
        if (username) {
          this.$router.push('/profile/' + username);
        }
      } else if (event.option === 'chat-challenge-user') {
        await this.$store.dispatch('challengeUser', +event.target);
        this.$router.push('/game');
      } else if (event.option === 'chat-make-admin') {
        this.handleMakeAdmin(+event.target);
      } else if (event.option === 'chat-message-user') {
        this.handleDmUser(+event.target);
      } else if (event.option === 'chat-block-user') {
        this.handleBlockUser(+event.target);
      } else if (event.option === 'chat-mute-user') {
        this.selectedUserId = +event.target;
        this.karma = 'mute';
      } else if (event.option === 'chat-ban-user') {
        this.selectedUserId = +event.target;
        this.karma = 'ban';
      }
    },
    async handleBlockUser(userId: number) {
      const data = {
        sourceId: this.$store.getters.id,
        targetId: userId,
      };
      await axios.post('/blocks', data).then(async () => {
        let response2 = await axios.get(
          '/users/' + this.$store.getters.id + '/friendships/',
        );
        for (let i = 0; i < response2.data.length; i++) {
          if (response2.data[i].user.id === userId) {
            await axios.delete('/friendships/' + response2.data[i].id);
          }
        }
        window.alert('The user is blocked');
        this.messages.clear();
        this.refreshChannels();
        if (this.selectedChannel?.id)
          this.getMessagesForChannel(this.selectedChannel.id);
      });
    },
    async handleMakeAdmin(userId: number) {
      if (!this.selectedChannel?.id) {
        return -1;
      }
      axios
        .get(`/memberships?channel=${this.selectedChannel.id}&user=${userId}`)
        .then((response) => {
          if (
            !response ||
            response.data.length !== 1 ||
            response.data[0].userId != userId
          ) {
            throw new Error("Could not find user's membership");
          }
          const membership = response.data[0];
          axios
            .patch(`/memberships/${membership.id}`, {
              role: MembershipRoleType.ADMIN,
            })
            .then((response) => {
              if (response.status === 200) {
                return response.data.id;
              }
              throw new Error('Error updating membership!');
            })
            .catch(() => {
              this.alert('Could not make user an admin');
            });
        })
        .catch(() => {
          this.alert('Could not find user in channel');
          return undefined;
        });
    },
    handleMessage(messageDto: MessageDto) {
      if (
        messageDto &&
        messageDto.senderId &&
        messageDto.content &&
        messageDto.channelId &&
        !this.blocks.includes(messageDto.senderId)
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
        this.users.set(userId, newUser);
      }
      return newUser;
    },
    async addMessageToMap(message: MessageDto) {
      if (!this.users.has(message.senderId)) {
        await this.addUserToMap(message.senderId);
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
        this.unreadChannels.add(message.channelId);
        this.newUnread += 1;
      } else {
        this.newMessage += 1;
      }
    },
    async fetchUserById(userId: number) {
      return axios
        .get(`/users/${userId}`)
        .then((response) => {
          const user = response?.data;
          if (user) return user;
          return { id: -1, username: 'Unknown User' };
        })
        .catch(() => {
          console.log('Could not find user');
        });
    },
    async getMessagesForChannel(channelId: number, pageNumber = 1) {
      axios
        .get(
          `/messages?channel=${channelId}&userId=${this.$store.getters.user.id}&order=DESC&page=${pageNumber}&take=10`,
        )
        .then(async (response) => {
          let newMessages = response.data.data;
          if (newMessages) {
            for (let message of newMessages) {
              this.addMessageToMap(message);
            }
          }
          if (response.data.meta.hasNextPage === true) {
            this.getMessagesForChannel(channelId, pageNumber + 1);
          }
        })
        .catch(() => {
          this.alert('Could not get messages for this channel at this time');
        });
    },
    async joinChannelById(id: number, password?: string) {
      const channel = this.allChannels.get(id);
      if (!channel) return;
      const data = {
        channelId: id,
        userId: this.$store.getters.id,
        role: MembershipRoleType.PARTICIPANT,
        password: password,
      };
      await axios.post('/memberships', data).catch(() => {
        this.alert('Could not join channel');
      });
    },
    leaveChannelById(id: number) {
      this.socket.emit('chat-leave', { channel: id }, (response: string) => {
        this.printResponse(response);
      });
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
      axios
        .get(`/memberships?channel=${channelId}&user=${this.$store.getters.id}`)
        .then((response) => {
          this.activeMembership = response.data[0];
        })
        .catch(() => {
          console.log('Could not find membership for this channel');
        });
    },
    async fetchMemberships() {
      axios
        .get(`/memberships?user=${this.$store.getters.id}`)
        .then((response) => {
          if (response.data) this.memberships = response.data;
        })
        .catch(() => {
          console.log('Could not fetch memberships');
        });
    },
    async fetchBlocks() {
      await axios
        .get(`/users/${this.$store.getters.id}/blocks`)
        .then((response) => {
          response.data.forEach((block: ListBlockDto) => {
            this.blocks.push(block.user.id);
          });
        });
    },
    async getAllChannels() {
      await axios.get('/channels/').then((response) => {
        const channels = response.data.data;
        if (channels) {
          for (let channel of channels) {
            this.allChannels.set(channel.id, channel);
          }
        }
        this.newUnread += 1;
      });
    },
    async refreshChannels() {
      this.allChannels.clear();
      this.subscribedChannels = [];
      this.blocks = [];
      await this.getAllChannels();
      await this.fetchMemberships();
      await this.fetchBlocks();
      for (let membership of this.memberships) {
        const channel = this.allChannels.get(membership.channelId);
        if (channel) {
          this.subscribedChannels.push(channel);
        }
      }
      this.socket.emit('chat-listen', (response: string) => {
        this.printResponse(response);
      });
    },
    handleDmUser(userId: number) {
      const id = this.$store.getters.id;
      let dto = new CreateChannelDto(
        'direct' + userId,
        'direct',
        undefined,
        +id,
        userId,
      );
      this.handleChannelCreation(dto);
    },
    alert(message: string) {
      window.alert(message);
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
    this.socket.emit('auth', {
      id: this.$store.getters.id,
      token: this.$store.getters.token,
    });
    this.refreshChannels();
    this.socket.on('chat-message', this.handleMessage);
    this.socket.on('membership-created', this.refreshChannels);
    this.socket.on('chat-unauthorized', (message: string) => {
      this.alert(message);
    });
    this.socket.on('chat-banned', (message: string) => {
      this.alert(message);
      this.messages.clear();
      this.refreshChannels();
      this.selectedChannel = undefined;
    });
    this.socket.on('chat-muted', (message: string) => {
      this.alert(message);
    });
    this.socket.on('refresh-channels', this.refreshChannels);
  },
  beforeRouteLeave() {
    this.socket.disconnect();
  },
  beforeDestroy() {
    this.socket.off('chat-message', this.handleMessage);
    this.socket.off('refresh-channels', this.refreshChannels);
    this.socket.disconnect();
  },
});
</script>

<style>
.button {
  cursor: pointer;
}
</style>
