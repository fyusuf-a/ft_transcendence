<template>
  <div>
    <v-hover>
      <template v-slot="{ isHovering, props }">
        <div v-bind="props">
          <span>{{ username() }}</span>
          <v-btn
            v-if="isHovering || dialog"
            color="accent"
            variant="text"
            size="x-small"
            prepend-icon="fa fa-pencil"
          >
            <v-dialog width="400" v-model="dialog" activator="parent">
              <v-card>
                <v-card-title>
                  <h5 class="text-h5">Change username</h5>
                </v-card-title>
                <v-card-text>
                  <v-form
                    id="change-username"
                    validate-on="submit"
                    v-model="valid"
                    @submit.prevent="changeUsername"
                  >
                    <v-text-field
                      v-model="newUsername"
                      :rules="usernameRules"
                      label="Username"
                      required
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    form="change-username"
                    type="submit"
                    @submit.prevent="changeUsername"
                    >Save</v-btn
                  >
                  <v-btn color="primary" @click="dialog = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </div>
      </template>
    </v-hover>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { UpdateUserDto } from '@dtos/users';
import { AxiosError } from 'axios';
export default defineComponent({
  data: () => ({
    dialog: false,
    valid: true,
    newUsername: '',
    usernameRules: [
      (v: string) => !!v || 'Name is required',
      (v: string) =>
        (v && v.length <= 15) || 'Name must be less than 15 characters',
    ],
    errors: [] as string[],
  }),
  methods: {
    ...mapGetters(['username', 'id']),
    async changeUsername() {
      let data: UpdateUserDto = {
        username: this.newUsername,
      };
      await axios
        .patch('/users/' + this.id(), data)
        .then(() => {
          this.$store.commit('setUsername', this.newUsername);
          this.dialog = false;
        })
        .catch((err) => {
          if (err instanceof AxiosError && err.response?.status == 403) {
            this.errors = [err.response.data.message];
          }
        });
    },
  },
});
</script>
