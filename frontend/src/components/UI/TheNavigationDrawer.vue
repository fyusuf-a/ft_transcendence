<template>
  <v-navigation-drawer mini-variant mini-variant-width="56" expand-on-hover 
                                                        color="secondary"
                                                        clipped app
                                                        v-model="expanded">
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item-group>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      expanded: this.visible,
      items: [
        { title: "Profile", icon: "mdi-account" },
        { title: "Play", icon: "mdi-gamepad-variant" },
        { title: "Chat", icon: "mdi-forum" },
        { title: "About", icon: "mdi-information-outline" },
      ],
      links: ["Home", "Contacts", "Settings"],
    };
  },
};
</script>
