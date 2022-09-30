<template>
  <v-menu :offset-x="true">
    <template v-slot:activator="{ props: tooltip }">
      <v-btn light icon v-bind="tooltip">
        <slot>Default</slot>
      </v-btn>
    </template>

    <v-list>
        <v-list-item v-for="(item, i) in options" :key="i" active-color="primary"
        @click="() => handleOptionSelection(item)">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

declare interface OptionType {
  label: string;
  event: string;
}

declare interface DataReturnType {
  regularOptions: OptionType[];
  adminOptions: OptionType[];
}

export default defineComponent({
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
    handleOptionSelection(item: OptionType) {
      this.$emit('chat-message-menu-selection', {
        option: item.event,
        target: this.targetId,
      });
    },
  },
  computed: {
    options: function (): OptionType[] {
      if (this.targetId === this.$store.getters.id) {
        return [this.regularOptions[0]];
      }
      if (this.clientIsAdmin) {
        return this.regularOptions.concat(this.adminOptions);
      }
      return this.regularOptions;
    },
  },
});
</script>
