<template>
  <v-card class="pa-2 ml-15 mr-15 mt-5" width="100%" >  
    <!-- <v-card-title>{{ username() }}</v-card-title> -->
    <v-card-title>louie</v-card-title>
  
      <v-container fluid>
        <v-row dense>

          <v-col :cols="4">
            <v-card class="mr-10" max-width="400"  >
              <v-img
              :src="avatar()"
               ></v-img>
            </v-card>
            <v-card-actions>
              <v-btn color="deep-purple lighten-2" text @click="reserve">
                Change picture
              </v-btn>
              <v-btn color="deep-purple lighten-2" text @click="reserve">
                Change username
              </v-btn>
            </v-card-actions>
          </v-col>

          <v-col :cols="4">
            <my-statistics />
          </v-col>
          
          <v-col :cols="4">
            <my-level />
          </v-col>
        </v-row>
      </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import MyStatistics from '@/components/Profile/MyStatistics.vue';
import MyLevel from '@/components/Profile/MyLevel.vue';

export default defineComponent({
  components: {
    'my-statistics': MyStatistics,
    'my-level': MyLevel,
  },
  methods: {
    ...mapGetters(['username', 'avatar']),
    reserve() {
      // TODO: remove and replace with 2 methods: one to change the username, one to change the picture
    },
  },
  created() {
    if (this.avatar() !== undefined) return;
    this.$store.dispatch('getAvatar');
  },
});
</script>
