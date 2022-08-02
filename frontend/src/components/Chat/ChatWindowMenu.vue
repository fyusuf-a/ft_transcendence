<template>
  <v-menu bottom left>
    <template v-slot:activator="{ props: tooltip }">
      <v-btn light icon v-bind="tooltip">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
        <v-list-item v-for="(item, i) in options" :key="i" active-color="primary" @click="() => handleOptionSelection(item)">
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

export default defineComponent({
  data() {
    return {
      selectedOption: -1,
      options: [{ label: 'Leave Channel', event: 'chat-leave-channel' }],
    };
  },
  methods: {
    handleOptionSelection(item: OptionType) {
      this.$emit(item.event);
    },
  },
});
</script>
