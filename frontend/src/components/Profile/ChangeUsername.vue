<template>
  <v-btn
    color="error"
    variant="outlined"
  >
    Change username
    <v-dialog
      v-model="dialog"
      activator="parent"
    >
      <v-card width="300" class="v-dialog-pos">
        <v-card-text v-if="nameAlreadyUsed === 500">
            This username is already used
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
            label="Name"
            required
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Validate
          </v-btn>

        </v-form>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">I changed my mind</v-btn>
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
    nameAlreadyUsed: 0,
    nameRules: [
      (v: string) => !!v || 'Name is required',
      (v: string) => (v && v.length <= 15) || 'Name must be less than 15 characters',
    ],
    select: null,
  }),
  methods: {
    ...mapGetters(['username', 'avatar', 'id']),
    validate () {
      this.changeUsername(this.name);
      (this.$refs.form as any).validate();
      (this.$refs.form as any).reset();
      this.nameAlreadyUsed = 0;
    },
    async changeUsername(name: string) {
      const data = {
        username: name,
    	};
      await axios.patch('/users/' + this.id(), data)
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch( (error) => {
          console.log(error.response);
          this.nameAlreadyUsed = error.response.status;
        });
        if (this.nameAlreadyUsed === 0) { this.dialog = false; };
    },
  },
});
</script>
