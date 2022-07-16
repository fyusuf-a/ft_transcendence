<template>
  <v-navigation-drawer
    mini-variant
    mini-variant-width="56"
    expand-on-hover
    color="secondary"
    clipped
    app
    @input="emitModelValue"
    :value="value"
  >
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item-group>
        <v-list-item v-for="item in items" :key="item.title" :to="item.route">
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
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
  methods: {
    emitModelValue(value) {
      this.$emit('input', value);
    },
  },
  data() {
    return {
      expanded: this.visible,
      items: [
        {
          title: 'Profile',
          icon: 'mdi-account',
          route: '/profile',
        },
        {
          title: 'Play',
          icon: 'mdi-gamepad-variant',
          route: '/game',
        },
        {
          title: 'Chat',
          icon: 'mdi-forum',
          route: '/chat',
        },
        {
          title: 'About',
          icon: 'mdi-information-outline',
          route: '/about',
        },
      ],
      links: ['Home', 'Contacts', 'Settings'],
    };
  },
});
</script>
