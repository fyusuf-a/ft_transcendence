import { createStore } from 'vuex';
import axios from 'axios';
import VuexPersister from 'vuex-persister';
import { ResponseUserDto, UserDto } from '@dtos/users';
import { fetchAvatar } from '@/utils/avatar';
import { LoginUserDto } from '@dtos/auth';

const vuexPersister = new VuexPersister({
  key: 'my_key',
  overwrite: true,
});

interface Cache {
  avatars: Map<number, string>;
}

interface State {
  user: ResponseUserDto;
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
    isUserAuthenticated(state): boolean {
      return state.user.id !== undefined && state.token !== '';
    },
    avatar: (state) => state.avatar,
    id: (state) => state.user.id,
    token: (state) => state.token,
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
  },
  modules: {},
  plugins: [vuexPersister.persist],
});
