<template>
  <v-btn color="white" class="text--primary ml-15">
    Add friend <v-icon>mdi-plus</v-icon>
    <v-dialog
      v-model="dialog"
      activator="parent"
    >
      <v-card width="300">
        <v-card-text v-if="nameDoesNotExist === 500">
          This user cannot be found.<br />
          Are they already your friend?<br />
          Or have they not accepted your request...? :(
        </v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="name"
            :counter="15"
            :rules="nameRules"
            label="Enter the name of your friend"
            required
          ></v-text-field>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="success"
              block
              class="mr-4"
              @click="validate"
            >
              Validate
            </v-btn>
          </v-card-actions>
        </v-form>
        <v-card-actions>
          <v-btn color="primary" block @click="reset">I changed my mind</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
export default defineComponent({
  data: () => ({
    dialog: false,
    valid: true,
    name: '',
    nameRules: [
      (v: string) => !!v || 'Name is required',
      (v: string) => (v && v.length <= 15) || 'Name must be less than 15 characters',
    ],
    nameDoesNotExist: 0,
  }),
  methods: {
    ...mapGetters(['id']),
    validate () {
      this.checkName(this.name);
      (this.$refs.form as any).validate();
      (this.$refs.form as any).reset();
      this.nameDoesNotExist = 0;
    },
    reset () {
      (this.$refs.form as any).reset();
      this.dialog = false;        
      this.nameDoesNotExist = 0;
    },
    async checkName (name: string) {
      const data = {
        sourceId: parseInt(this.id()),
        targetId: 0
      };
      let responseBlocked = await axios.get('/users/' + this.id() + '/blocks/');
        for (let i: number = 0; i < responseBlocked.data.length; i++) {
          console.log(responseBlocked.data[i])
          if (responseBlocked.data[i].user.username === name) {
            window.alert('This user is blocked. Unblocked them first.');
            return;
          }
        };
      await axios.post('/friendships/' + name, data)
        .then(async response => {
          console.log(response);
          let response2 = await axios.get('/users/' + this.id() + '/friendships/invites');
          for (let i: number = 0; i < response2.data.length; i++) {
            if (response2.data[i].user.username === name) {
              window.alert('This user already sends you a friend request. Check your pending requests :)');
              return;
            }
          };
          window.alert('Your friend request has been sent.');
        })
        .catch( (error) => {
          console.log(error.response.status);
          this.nameDoesNotExist = error.response.status;
        });
        if (this.nameDoesNotExist === 0) { this.dialog = false; };
    },
  },
});
</script>
