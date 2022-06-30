import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: undefined,
  },
  getters: {},
  mutations: {
    login(state, loginDto) {
      state.user = loginDto;
      state.isAuthenticated = true;
    },
  },
  actions: {},
  modules: {},
});
