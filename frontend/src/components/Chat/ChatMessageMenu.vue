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

<script lang="ts">
import Vue from 'vue';

declare interface OptionType {
  label: string;
  event: string;
}

declare interface DataReturnType {
  selectedOption: number;
  regularOptions: OptionType[];
  adminOptions: OptionType[];
}

export default Vue.extend({
  props: {
    targetId: {
      type: Number,
      required: true,
    },
    clientIsAdmin: {
      type: Boolean,
      default: false,
    },
  },
  data(): DataReturnType {
    return {
      selectedOption: 0,
      regularOptions: [
        { label: 'View Profile', event: 'chat-profile-user' },
        { label: 'Challenge', event: 'chat-challenge-user' },
        { label: 'Message', event: 'chat-message-user' },
        { label: 'Friend', event: 'chat-friend-user' },
        { label: 'Block', event: 'chat-block-user' },
      ],
      adminOptions: [
        { label: 'Mute', event: 'chat-mute-user' },
        { label: 'Ban', event: 'chat-ban-user' },
      ],
    };
  },
  methods: {
    handleOptionSelection() {
      this.$emit('chat-message-menu-selection', {
        option: this.options[this.selectedOption].event,
        target: this.targetId,
      });
      this.selectedOption = 0;
    },
  },
  computed: {
    options: function (): OptionType[] {
      if (this.clientIsAdmin) {
        return this.regularOptions.concat(this.adminOptions);
      }
      return this.regularOptions;
    },
  },
});
</script>
