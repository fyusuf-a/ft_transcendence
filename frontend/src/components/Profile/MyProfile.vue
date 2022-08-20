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
            <v-card-actions>

              <v-btn color="deep-purple lighten-2" text @click="reserve">
                Change picture
              </v-btn>
              
              <!-- <v-btn color="deep-purple lighten-2" text @click="changeUsername">
                Change username
              </v-btn> -->
              <v-btn
                color="primary"
              >
                Change username
                <v-dialog
                  v-model="dialog"
                  activator="parent"
                >
                  <v-card >
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
                    

                      <v-checkbox
                        v-model="checkbox"
                        :rules="checkboxRules"
                        label="Do you agree?"
                        required
                      ></v-checkbox>

                      <v-btn
                        :disabled="!valid"
                        color="success"
                        class="mr-4"
                        @click="validate"
                      >
                        Validate
                      </v-btn>

                      <v-btn
                        color="error"
                        class="mr-4"
                        @click="reset"
                      >
                        Reset Form
                      </v-btn>
                    </v-form>
                    <v-card-actions>
                      <v-btn color="primary" block @click="dialog = false">I changed my mind</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
    checkboxRules: [
      (v: string) => !!v || 'You must agree to continue!',
    ],
    select: null,
    checkbox: false,
  }),
  components: {
    'my-statistics': MyStatistics,
    'my-level': MyLevel,
  },
  methods: {
    ...mapGetters(['username', 'avatar', 'id']),

    reserve() {
      // TODO: remove and replace with 2 methods: one to change the username, one to change the picture
    },

    validate () {
      this.changeUsername(this.name);
      (this.$refs.form as any).validate();
      this.checkbox = false;
      (this.$refs.form as any).reset();
      this.nameAlreadyUsed = 0;
    },
    
    reset () {
      (this.$refs.form as any).reset();
      this.checkbox = false;
      this.nameAlreadyUsed = 0;
    },

    async changeUsername(name: string) {
      const data = {
        username: name,
    	};

      await axios.patch('/users/' + this.id(), data)
        .then(response => {
          console.log(response);
        })
        .catch( (error) => {
          console.log(error.response);
          this.nameAlreadyUsed = error.response.status;
        })
      ;

      const response2 = await axios.get('http://localhost:8080/users/' + this.id());

        this.$store.commit('setUsername', response2.data.username);
        if (this.nameAlreadyUsed === 0) { this.dialog = false; };
    },
  },

  created() {
    if (this.avatar() !== undefined) return;
    this.$store.dispatch('getAvatar');
  },
});
</script>
