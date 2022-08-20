<template>
  <v-card class="pa-2 ml-15 mr-15 mt-5" width="84%" >
    <v-card-title>{{ username() }}</v-card-title>
  
      <v-container fluid>
        <v-row dense>

          <v-col :cols="4">
            <v-card class="mr-10" max-width="400"  >
              <v-img
              :src="avatar()"
               ></v-img>
            </v-card>
            <v-card-actions class="pt-10">

              <!-- <v-btn color="deep-purple lighten-2" text @click="reserve">
                Change picture
              </v-btn> -->
              <v-btn color="primary">
                <avatar-button />
              </v-btn>

              <!-- <v-btn color="deep-purple lighten-2" text @click="changeUsername">
                Change username
              </v-btn> -->
              <v-btn color="primary">
                <username-button />
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
import ChangeUsername from '@/components/Profile/ChangeUsername.vue';
import ChangeAvatar from '@/components/Profile/ChangeAvatar.vue';

export default defineComponent({
  data: () => ({
    dialog: false,}),
  components: {
    'my-statistics': MyStatistics,
    'my-level': MyLevel,
    'username-button': ChangeUsername,
    'avatar-button': ChangeAvatar,
  },
  methods: {
    ...mapGetters(['username', 'avatar',]),
  },
  created() {
    if (this.avatar() !== undefined) return;
    this.$store.dispatch('getAvatar');
  },
});
</script>
