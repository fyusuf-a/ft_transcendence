import { createStore } from 'vuex';
import axios from 'axios';
import kingPongImg from '@/assets/images/king-pong.png';
import VuexPersister from 'vuex-persister';
import { ResponseUserDto, UserDto } from '@dtos/users';
import Vue from 'vue';
import Vuex from 'vuex';

import { fetchAvatar } from '@/utils/avatar';

const vuexPersister = new VuexPersister({
  key: 'my_key',
  overwrite: true,
});

interface Cache {
  avatars: Map<number, string>;
}

interface State {
  user: UserDto;
  avatar: string | undefined;
  token: string | undefined;
  cache: Cache | undefined;
}

const state: State = {
  user: new UserDto(),
  avatar: undefined,
  token: undefined,
  cache: undefined,
};

export default createStore({
  state: state,
  getters: {
    user: (state) => state.user,
    username: (state) => state.user.username,
    userIsAuthenticated(state): boolean {
      return state.user.id !== undefined && state.token !== '';
    },
    userIsCreated(state): boolean {
      return state.user.username !== undefined;
    },
    avatar: (state) => state.avatar,
    id: (state) => state.user.id,
    token: (state) => state.token,
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
    },
    setUsername(state, username: string) {
      state.user.username = username;
    },
    login(state, { id, token }: { id: number; token: string }) {
      state.user.id = id;
      state.token = token;
    },
  },
  actions: {
    async getAvatarById(context, id: number) {
      if (id) {
        if (context.state.cache?.avatars.has(+id)) {
          return context.state.cache?.avatars.get(+id);
        }
        return await fetchAvatar(id);
      }
    },
    async getAvatar(context) {
      if (context?.state?.user.id) {
        if (context.state.cache?.avatars.has(+context?.state?.user.id)) {
          context.state.avatar = context.state.cache?.avatars.get(
            +context?.state?.user.id,
          );
        }
        context.state.avatar = await fetchAvatar(context.state.user.id);
      }
    },
  },
  modules: {},
  plugins: [vuexPersister.persist],
});
