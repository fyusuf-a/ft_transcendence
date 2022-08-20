<template>
  <v-card class="pa-2 ml-15 mr-15 mt-5" width="84%" >
    <v-card-title>{{ username() }}</v-card-title>
  
      <v-container fluid>
        <v-row dense>

          <v-col :cols="4">

            <v-card class="mr-10" max-width="400"  >
              <v-img
              :src="tmpAvata"
               ></v-img>
              <!-- :src="avatar()" -->
            </v-card>

            <v-card-actions class="pt-10">

              <v-row>
                <v-btn color="primary">
                  <avatar-button />
                </v-btn>

                <v-btn color="primary">
                  <username-button />
                </v-btn>
              </v-row>
            </v-card-actions>

          </v-col>

          <v-col :cols="8">
            <my-statistics />
          </v-col>

        </v-row>
      </v-container>

  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import MyStatistics from '@/components/Profile/MyStatistics.vue';
import ChangeUsername from '@/components/Profile/ChangeUsername.vue';
import ChangeAvatar from '@/components/Profile/ChangeAvatar.vue';

import kingPongImg from '@/assets/images/king-pong.png'; //

export default defineComponent({
  data: () => ({
    dialog: false,
    tmpAvata: kingPongImg, //
    }),
  components: {
    'my-statistics': MyStatistics,
    'username-button': ChangeUsername,
    'avatar-button': ChangeAvatar,

  },
  methods: {
    ...mapGetters(['username', 'avatar']),
  },
  created() {
    if (this.avatar() !== undefined) return;
    this.$store.dispatch('getAvatar');
  },
});
</script>
