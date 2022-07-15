import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.config.productionTip = false;

const vue = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

axios.defaults.baseURL = `http://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}`;

axios.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["Authorization"] = "Bearer " + vue.$store.getters.token;
  return config;
});
