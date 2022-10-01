<template>
  <v-btn icon @click="toggleMenu">
    <v-icon v-if="alert" color="accent">mdi-bell</v-icon>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>
  <notification-menu v-if="displayMenu"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotificationMenu  from './NotificationMenu.vue';
import { mapMutations } from 'vuex';

export default defineComponent({
    data() {
        return {
            alert: false,
            socket: this.$store.getters.socket,
            displayMenu: false,
        };
    },
    created() {
        this.socket.on("alert-message", (data: string) => this.handleMessage(data));
        this.socket.on("alert-challenge", (username: string, userId: number) => this.handleChallenge(username, userId));
    },
    methods: {
      ...mapMutations(['pushNotification']),
        handleChallenge(message: string, userId: number) {
            this.alert = true;
            this.$store.commit('pushNotification', {message: message, userId: userId});
            console.log(message + " id: " + userId);
        },
        handleMessage(message: string) {
            this.alert = true;
            this.$store.commit('pushNotification', {message: message, userId:0});
            console.log(message);
        },
        toggleMenu() {
            this.displayMenu = (this.displayMenu) ? false : true;
        },
        reverseAlert() {
            this.alert = !this.alert;
        },
    },
    components: { NotificationMenu }
});
</script>
