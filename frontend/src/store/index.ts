import { createStore } from 'vuex';
import axios from 'axios';
import kingPongImg from '@/assets/images/king-pong.png';

interface State {
  isAuthenticated: boolean;
  username: string | undefined;
  avatar: string | undefined;
  id: string | undefined;
  token: string | undefined;
}

const state: State = {
  isAuthenticated: false,
  username: undefined,
  avatar: undefined,
  id: undefined,
  token: undefined,
};

export default createStore({
  state: state,
  getters: {
    username: (state) => state.username,
    isAuthenticated: (state) => state.isAuthenticated,
    avatar: (state) => state.avatar,
    id: (state) => state.id,
    token: (state) => state.token,
  },
  mutations: {
    login(state, payload) {
      state.username = payload.username;
      state.id = payload.id;
      state.isAuthenticated = true;
      state.token = payload.token;
    },
  },
  actions: {
    async getAvatar(context) {
      try {
        const id = context.state.id;
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
});
