import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: undefined,
    userId: undefined,
  },
  getters: {},
  mutations: {
    login(state, loginDto) {
      state.user = loginDto;
      state.isAuthenticated = true;
    },
    updateUserId(state, userId) {
      if (state.user) {
        state.userId = userId;
      }
    },
  },
  actions: {},
  modules: {},
});
