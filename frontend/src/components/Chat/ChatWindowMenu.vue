<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {},
  data() {
    return {
      options: [
        { label: "Leave Channel", event: "chat-leave-channel" },
        {
          label: "Admin Options Not Yet Implemented",
          event: "chat-not-implemented",
        },
      ],
    };
  },
  components: {},
  methods: {},
  computed: {},
  // mounted() {

  // },
});
</script>

<template>
  <v-menu bottom left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn light icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="(item, i) in options" :key="i">
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
