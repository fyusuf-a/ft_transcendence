import { createStore } from 'vuex';
import axios from 'axios';
import kingPongImg from '@/assets/images/king-pong.png';
import VuexPersister from 'vuex-persister';
import { ResponseUserDto, UserDto } from '@dtos/users';
import { io, Socket } from 'socket.io-client';

const vuexPersister = new VuexPersister({
  key: 'my_key',
  overwrite: true,
});

interface State {
  user: UserDto;
  avatar: string | undefined;
  token: string | undefined;
  socket: Socket;
}

const state: State = {
  user: new UserDto(),
  avatar: undefined,
  token: undefined,
  socket: io(),
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
    socket: (state) => state.socket,
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
    setSocket(state, socket: Socket) {
      state.socket = socket;
    }
  },
  actions: {
    async getUser(context, { id, token }: { id: number; token: string }) {
      context.state.token = token;
      context.state.user.id = id;
      const response = await axios.get<ResponseUserDto>('/users/' + id);
      context.state.user = {
        avatar: '',
        membershipIds: [],
        ...response.data,
      };
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
  modules: {},
  plugins: [vuexPersister.persist],
});
