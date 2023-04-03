import { createStore, Plugin, Store } from 'vuex';
import axios from 'axios';
import VuexPersister from 'vuex-persister';
import { ResponseUserDto, UserDto } from '@dtos/users';
import { io, Socket } from 'socket.io-client';
import { fetchAvatar } from '@/utils/avatar';
import { LoginUserDto } from '@dtos/auth';

const vuexPersister = new VuexPersister({
  key: 'my_key',
  statesToPersist: ['user', 'token'],
  overwrite: true,
});

interface Cache {
  avatars: Map<number, string>;
}

export interface RootState {
  user: ResponseUserDto;
  avatar: string | undefined;
  token: string | undefined;
  socket: Socket | undefined;
  chatSocket: Socket | undefined;
  cache: Cache | undefined;
  notifications: Array<Notification>;
  challengedUserId: number;
  spectatedUserId: number;
}

const state: RootState = {
  user: new UserDto(),
  avatar: undefined,
  token: undefined,
  socket: undefined,
  chatSocket: undefined,
  cache: undefined,
  notifications: [],
  challengedUserId: 0,
  spectatedUserId: 0,
};

interface Mutation {
  type: string;
}

const createWebSocketPlugin: Plugin<RootState> = (store: Store<RootState>) => {
  store.subscribe((mutation: Mutation) => {
    if (mutation.type === 'setSocket') {
      store.state.socket = io('/notifications', {
        query: {
          id: store.state.user.id,
          token: store.state.token as string,
        },
      });
      store.state.chatSocket = io('/chat', {
        query: {
          id: store.state.user.id,
          token: store.state.token as string,
        },
      });
    }
  });
};

export const store = createStore({
  state: state,
  getters: {
    user: (state) => state.user,
    username: (state) => state.user.username,
    isUserAuthenticated(state): boolean {
      return state.user.id !== undefined && state.token !== '';
    },
    avatar: (state) => state.avatar,
    id: (state) => state.user.id,
    token: (state) => state.token,
    socket: (state) => state.socket,
    chatSocket: (state) => state.chatSocket,
    notifications: (state) => state.notifications,
    challengeUserId: (state) => {
      if (!state.challengedUserId) return 0;
      else return state.challengedUserId;
    },
    spectateUserId: (state) => {
      if (!state.spectatedUserId) return 0;
      else return state.spectatedUserId;
    },
  },
  mutations: {
    login(state, { id, token }: LoginUserDto) {
      state.user.id = id;
      state.token = token;
    },
    setSocket() {
      console.log('Connecting to notifications socket.');
    },
    logout(state) {
      state.user = new UserDto();
      state.token = undefined;
    },
  },
  actions: {
    async verifyLoginInfo(
      context,
      { id, token }: { id: number; token: string },
    ): Promise<ResponseUserDto> {
      let user: ResponseUserDto;
      try {
        context.state.token = token;
        const response = await axios.get<ResponseUserDto>('/users/me');
        user = response.data;
        context.commit('login', { id, token });
        context.state.user = {
          ...response.data,
        };
        return user;
      } catch (e) {
        context.commit('logout');
        throw e;
      }
    },
    async verify2FA(context, { code }: { code: number }): Promise<void> {
      const response = await axios.post<string>('/auth/2fa/authenticate', {
        twoFACode: code,
      });
      context.commit('login', { id: context.getters.id, token: response.data });
    },
    async getAvatarById(context, id: string) {
      if (id) {
        if (context.state.cache?.avatars.has(+id)) {
          return context.state.cache?.avatars.get(+id);
        }
        return await fetchAvatar(+id);
      }
    },
    async getAvatar(context) {
      if (context?.state?.user?.id) {
        if (context.state.cache?.avatars.has(+context?.state?.user?.id)) {
          context.state.avatar = context.state.cache?.avatars.get(
            +context?.state?.user?.id,
          );
        } else {
          context.state.avatar = await fetchAvatar(+context.state.user.id);
        }
      }
    },
    challengeUser(context, userId: number) {
      context.state.challengedUserId = userId;
    },
    removeChallenge(context) {
      context.state.challengedUserId = 0;
    },
    spectateUser(context, userId: number) {
      context.state.spectatedUserId = userId;
    },
    removeSpectate(context) {
      context.state.spectatedUserId = 0;
    },
  },
  modules: {},
  plugins: [vuexPersister.persist, createWebSocketPlugin],
});

export default store;
