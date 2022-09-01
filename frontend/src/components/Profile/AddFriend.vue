<template>
    <!-- <v-btn color="white" class="text--primary ml-15" fab small>
        Add friend <v-icon>mdi-plus</v-icon>
      </v-btn> -->
      <div>lol</div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default defineComponent({
  data: () => ({
    dialog: true,
  }),

  methods: {
    ...mapGetters(['username', 'avatar', 'id']),
  },
});
</script>
  
<style scoped>

</style>
  