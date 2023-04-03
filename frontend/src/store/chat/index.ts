import { createStore, Store } from 'vuex';
import store from '..';
import { ChannelDto } from '@dtos/channels';
import axios from 'axios';
import { MembershipDto, MembershipRoleType } from '@dtos/memberships';
import { ChatStoreState, state } from './state';
import { LoginUserDto } from '@dtos/auth';
import { UserDto } from '@dtos/users/user.dto';
import { Socket } from 'socket.io-client';

export const chatStore: Store<ChatStoreState> = createStore({
  state: state,
  getters: {
    socket: (state) => state.socket,
    connected: (state) => state.connected,
    subscribedChannels: (state) => {
      return state.subscribedChannels;
    },
  },
  mutations: {
    login(state, { id, token }: LoginUserDto) {
      state.user.id = id;
      state.token = token;
    },
    logout(state) {
      state.user = new UserDto();
      state.token = undefined;
    },
    addMembership(state, payload: MembershipDto) {
      state.memberships.push(payload);
    },
  },
  actions: {
    async connectSocket(context, socket: Socket) {
      if (socket == state.socket) return;
      await this.dispatch('unsetListeners');
      context.state.socket = socket;
      await this.dispatch('setListeners');
    },
    async setListeners(context) {
      context.state.socket?.on('membership-created', () =>
        this.dispatch('fetchMemberships'),
      );
    },
    async unsetListeners() {
      this.state.socket?.off('membership-created', () =>
        this.dispatch('fetchMemberships'),
      );
    },
    async fetchChannels(context): Promise<Array<ChannelDto>> {
      context.state.allChannels.clear();
      return axios
        .get('/channels/')
        .then((response) => {
          const channels = response.data.data;
          if (channels) {
            for (const channel of channels) {
              context.state.allChannels.set(channel.id, channel);
            }
          }
          return channels;
        })
        .catch(() => {
          return [];
        });
    },
    async fetchMembership(context, channelId: number): Promise<MembershipDto> {
      return axios
        .get(`/memberships?channel=${channelId}&user=${store.getters.id}`)
        .then((response) => {
          return response.data[0];
        })
        .catch(() => {
          console.log('Could not find membership for this channel');
        });
    },
    async fetchMemberships(context): Promise<Array<MembershipDto>> {
      context.state.memberships = [];
      return axios
        .get(`/memberships?user=${store.getters.id}`)
        .then((response) => {
          if (response.data) context.state.memberships = response.data;
          return context.state.memberships;
        })
        .catch(() => {
          return context.state.memberships;
        });
    },
    async fetchSubscribedChannels(context): Promise<Array<ChannelDto>> {
      await context.dispatch('fetchChannels');
      await context.dispatch('fetchMemberships');
      context.state.subscribedChannels = [];
      for (const membership of context.state.memberships) {
        const channel = context.state.allChannels.get(membership.channelId);
        if (channel) {
          context.state.subscribedChannels.push(channel);
        }
      }
      return context.state.subscribedChannels;
    },
    async fetchJoinableChannels(context) {
      await context.dispatch('fetchSubscribedChannels');
      return Array.from(context.state.allChannels.values())
        .filter((chan) => chan.type === 'public' || chan.type === 'protected')
        .filter(
          (chan) => !context.state.subscribedChannels.includes(chan),
        ) as ChannelDto[];
    },
    async joinChannel(
      context,
      args: { channelId: number; password?: string },
    ): Promise<MembershipDto> {
      const data = {
        channelId: args.channelId,
        userId: store.getters.id,
        role: MembershipRoleType.PARTICIPANT,
        password: args.password,
      };
      return axios
        .post('/memberships', data)
        .then((response) => {
          console.log(response.data);
          context.commit('addMembership', response.data);
          return response.data;
        })
        .catch((error) => {
          return Promise.reject(
            `Could not join channel ${args.channelId}: ${error}`,
          );
        });
    },
  },
});
