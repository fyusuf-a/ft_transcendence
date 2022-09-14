import { createStore } from 'vuex';
import axios from 'axios';
import kingPongImg from '@/assets/images/king-pong.png';
import VuexPersister from 'vuex-persister';
import { ResponseUserDto, UserDto } from '@dtos/users';
import { LoginUserDto } from '@dtos/auth';
import usersModule from './modules/users/index';


const vuexPersister = new VuexPersister({
  key: 'my_key',
  overwrite: true,
});

interface State {
  user: ResponseUserDto;
  avatar: string | undefined;
  token: string | undefined;
}

const state: State = {
  user: new UserDto(),
  avatar: undefined,
  token: undefined,
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
    async getAvatar(context) {
      try {
        const id = context.state.user.id;
        if (id === undefined) return undefined;
        const response = await axios.get('/users/' + id + '/avatar', {
          responseType: 'blob',
        });
        if (response.status === 204) return;
        const blob = new Blob([response.data]);
        context.state.avatar = URL.createObjectURL(blob);
      } finally {
        if (!context.state.avatar) {
          context.state.avatar = kingPongImg;
        }
      }
    },
  },
  modules: {
    usersModule: usersModule,
  },
  plugins: [vuexPersister.persist],
});
