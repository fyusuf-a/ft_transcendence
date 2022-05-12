<template>
  <v-app-bar color="primary" dark app clipped-left>
    <v-app-bar-nav-icon @click="toggleNavigationDrawer()" />
    <v-app-bar-title>
      <div color="primary">King Pong</div>
    </v-app-bar-title>

    <v-spacer />

    <profile-card :profile="profile" color="primary" height="100%" />

    <notification-icon
      @click="notification = !notification"
      :alert="notification"
    />
  </v-app-bar>
</template>

<script>
import NotificationIcon from "@/components/Notifications/NotificationIcon.vue";
import ProfileCard from "@/components/Profile/ProfileCard.vue";

export default {
  events: ["toggle-navigation-drawer"],
  components: {
    "profile-card": ProfileCard,
    "notification-icon": NotificationIcon,
  },
  data() {
    return {
      profile: {
        picture: "https://static.generated.photos/vue-static/home/hero/3.png",
        pseudo: "my_pseudo",
      },
      notification: true,
    };
  },
  methods: {
    toggleNavigationDrawer() {
      this.$emit("toggle-navigation-drawer");
    },
  },
};
</script>
