<template>
    <v-card class="pa-2 ml-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4" align="center">
      Achievements
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card>
        achievements list
    </v-card>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  
  methods: {
    ...mapGetters(['username', 'avatar', 'id']),
  },
});
</script>