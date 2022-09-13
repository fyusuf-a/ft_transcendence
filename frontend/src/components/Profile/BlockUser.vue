<template>
  <v-btn color="white" class="text--primary ml-15">
    Block a user <v-icon>mdi-plus</v-icon>
    <v-dialog
      v-model="dialog"
      activator="parent"
    >
      <v-card width="360">
        <v-card-text v-if="nameDoesNotExist === 500">
          This user cannot be found.<br />
          Isn't the user already blocked?
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
            label="Enter the name of the user you want to block"
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
      await axios.post('/blocks/' + name, data)
      .then(async response => {
        // console.log(response);
        let response2 = await axios.get('/users/' + this.id() + '/friendships/');
        for (let i: number = 0; i < response2.data.length; i++) {
          if (response2.data[i].user.username === name) {
            await axios.delete('/friendships/' + response2.data[i].id);
          }
        };
        window.alert('The user is blocked');
        window.location.reload();
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
