import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { configureAxios } from './plugins/axios';
import { loadFonts } from './plugins/webfontloader';

loadFonts();
configureAxios();

createApp(App).use(vuetify).use(router).use(store).mount('#app');
