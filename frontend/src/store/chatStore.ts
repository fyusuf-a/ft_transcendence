import { io, Socket } from 'socket.io-client';
import { createStore } from 'vuex';
import store from '.';
import { ChannelDto } from '@dtos/channels';
import { MessageDto } from '@dtos/messages';
import axios from 'axios';
import { MembershipDto } from '@dtos/memberships';

interface ChatStoreState {
  connected: boolean;
  socket: Socket | undefined;
  channels: Array<ChannelDto>;
  memberships: Array<MembershipDto>;
  allChannels: Map<number, ChannelDto>;
  subscribedChannels: Array<ChannelDto>;
  messages: Map<number, Array<MessageDto>>;
}

export const chatSocket = io('/chat', {
  query: {
    id: store.state.user.id,
    token: store.state.token as string,
  },
});

const state: ChatStoreState = {
  connected: false,
  socket: chatSocket,
  channels: [],
  allChannels: new Map(),
  subscribedChannels: [],
  messages: new Map(),
  memberships: [],
};

export default createStore({
  state: state,
  getters: {
    socket: (state) => state.socket,
    connected: (state) => state.connected,
    subscribedChannels: (state) => {
      return state.subscribedChannels;
    },
  },
  mutations: {},
  actions: {
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
  },
});
