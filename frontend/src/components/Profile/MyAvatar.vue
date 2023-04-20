<template>
  <v-hover>
    <template v-slot="{ isHovering, props }">
      <v-avatar size="100" v-bind="props">
        <v-img
          :src="avatar()"
          cover
          class="d-flex flex-row justify-center align-center"
        >
          <v-overlay
            :model-value="isHovering || dialog"
            contained
            class="align-center justify-center ma-0 pa-0"
          >
            <v-btn
              color="accent"
              icon=""
              class="ma-1"
              size="100"
              variant="text"
            >
              <v-icon size="large" icon="fa fa-gear" />
              <v-dialog width="400" v-model="dialog" activator="parent">
                <v-card>
                  <v-card-title>
                    <h5 class="text-h5">Select an avatar</h5>
                  </v-card-title>
                  <v-card-text>
                    <v-form id="avatar-upload" @submit.prevent="changeAvatar">
                      <v-file-input
                        v-model="file"
                        label="Select a file"
                        variant="solo"
                        :error-messages="errors"
                      ></v-file-input>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" form="avatar-upload" type="submit">
                      Save
                    </v-btn>
                    <v-btn color="primary" @click="dialog = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-btn>
          </v-overlay>
        </v-img>
      </v-avatar>
    </template>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { AxiosError } from 'axios';
export default defineComponent({
  watch: {
    file: function () {
      this.errors = [];
    },
  },
  data: () => ({
    dialog: false,
    file: undefined as unknown as File[] | undefined,
    errors: [] as string[],
  }),
  async created() {
    await this.$store.dispatch('getAvatar');
  },
  methods: {
    ...mapGetters(['avatar', 'id']),
    async changeAvatar() {
      if (!this.file || this.file?.length === 0) return;
      try {
        let formData = new FormData();
        formData.append('file', this.file[0]);
        await axios
          .post('/users/' + this.id() + '/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(() => {
            if (this.file) {
              this.$store.state.avatar = URL.createObjectURL(
                new Blob([this.file[0]]),
              );
            }
          });
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status == 400) {
          this.errors = [err.response.data.message];
        }
      }
    },
  },
});
</script>

<style scoped>
.on-hover {
  opacity: 20%;
}
</style>
