import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#05616a",
        secondary: "#52a89f",
        accent: "#f7a644",
        error: "#da5a54",
      },
    },
  },
});
