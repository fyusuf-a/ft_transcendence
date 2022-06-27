<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    targetId: Number,
  },
  data() {
    return {
      selectedOption: -1,
      options: [
        { label: "View Profile", event: "chat-profile-user" },
        { label: "Challenge", event: "chat-challenge-user" },
        { label: "Message", event: "chat-message-user" },
        { label: "Friend", event: "chat-friend-user" },
        { label: "Block", event: "chat-block-user" },
      ],
    };
  },
  components: {},
  methods: {
    handleOptionSelection() {
      console.log(
        `selectedOption: ${this.selectedOption}\ntargetId: ${this.targetId}`
      );
      if (this.options[this.selectedOption]) {
        console.log(`event: ${this.options[this.selectedOption].event}`);
      }
      this.$emit("chat-message-menu-selection", {
        option: this.options[this.selectedOption].event,
        target: this.targetId,
      });
    },
  },
  computed: {},
  // mounted() {

  // },
});
</script>

<template>
  <v-menu :offset-x="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn light icon v-bind="attrs" v-on="on">
        <slot>Default</slot>
      </v-btn>
    </template>

    <v-list>
      <v-list-item-group
        v-model="selectedOption"
        color="primary"
        @change="handleOptionSelection"
      >
        <v-list-item v-for="(item, i) in options" :key="i">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>
