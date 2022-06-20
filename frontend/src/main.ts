import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";

Vue.config.productionTip = false;

Vue.use(VueSocketIOExt, io("http://localhost:8080"));

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
