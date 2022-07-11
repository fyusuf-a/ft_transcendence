import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

interface State {
  isAuthenticated: boolean;
  username: string | undefined;
  avatar: string | undefined;
  id: string | undefined;
  token: string | undefined;
  backend: string;
}

const state: State = {
  isAuthenticated: false,
  username: undefined,
  avatar: undefined,
  id: undefined,
  token: undefined,
  backend: "http://localhost:8080",
};

export default new Vuex.Store({
  state: state,
  getters: {
    username(state) {
      return state.username;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    avatar(state) {
      return state.avatar;
    },
    tokenHeader(state) {
      return {
        Authorization: "Bearer " + state.token,
      };
    },
    backend(state) {
      return state.backend;
    },
  },
  mutations: {
    login(state, payload) {
      state.username = payload.username;
      state.token = payload.token;
      state.id = payload.id;
      state.isAuthenticated = true;
    },
  },
  actions: {
    async getAvatar(context) {
      const id = context.state.id;
      if (id === undefined) return undefined;
      await axios
        .get(context.getters.backend + "/users/" + id + "/avatar", {
          responseType: "blob",
          headers: context.getters.tokenHeader,
        })
        .then((response) => {
          if (response.status === 204) return;
          console.log(response);
          const blob = new Blob([response.data]);
          context.state.avatar = URL.createObjectURL(blob);
        })
        .catch(() => {
          context.state.avatar = undefined;
        });
    },
  },
  modules: {},
});
