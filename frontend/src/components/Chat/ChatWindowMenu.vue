<template>
  <v-menu bottom left>
    <template v-slot:activator="{ props: tooltip }">
      <v-btn light icon v-bind="tooltip">
        <v-icon>mdi-dots-vertical</v-icon>
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
import { defineComponent } from 'vue';
export default defineComponent({
  data() {
    return {
      selectedOption: -1,
      options: [{ label: 'Leave Channel', event: 'chat-leave-channel' }],
    };
  },
  methods: {
    handleOptionSelection() {
      this.$emit(this.options[this.selectedOption].event);
    },
  },
});
</script>
