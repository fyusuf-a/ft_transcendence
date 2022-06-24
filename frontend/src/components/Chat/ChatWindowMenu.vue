<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {},
  data() {
    return {
      selectedOption: -1,
      options: [{ label: "Leave Channel", event: "chat-leave-channel" }],
    };
  },
  components: {},
  methods: {
    handleOptionSelection() {
      this.$emit(this.options[this.selectedOption].event);
    },
  },
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
