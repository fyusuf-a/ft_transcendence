<template>
<v-menu
  top="true"
  right="true"
  offset-x="true"
  offset-overflow="true"
  >
  <template v-slot:activator="{ props }">
  <v-btn icon
        v-bind="props"
        @click="toggle_alert"
        >
    <v-icon v-if="alert" color="accent">mdi-bell</v-icon>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>

</template>
<v-list>
    <v-list-item  v-for="item in notifications"
                  :key="item.key"
                  :to="item.route"
                  :title="item.message">
    </v-list-item>
  </v-list>
</v-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
    data() {
        return {
            alert: false,
            open: false,
            socket: this.$store.getters.socket,
            notifications: this.$store.getters.notifications,
        };
    },
    created() {
        this.socket.on("alert-message", (data: string) => this.handleMessage(data));
        this.socket.on("alert-challenge", (username: string, userId: number) => this.handleChallenge(username, userId));
    },
    methods: {
      ...mapMutations(['pushNotification']),
        toggle_alert() {
            this.alert = false;
        },
        handleChallenge(message: string, userId: number) {
            this.alert = true;
            this.$store.dispatch('pushNotification', {message: message, userId: userId, route:`/game/`});
        },
        handleMessage(message: string) {
            this.alert = true;
            this.$store.dispatch('pushNotification', {message: message, userId:0, route:"/chat"});
        },
        reverseAlert() {
            this.alert = !this.alert;
        },
    },
});
</script>
