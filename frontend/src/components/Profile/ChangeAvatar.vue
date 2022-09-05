<template>
  <v-btn
    color="primary"
  >
    Change avatar
    <v-dialog
      v-model="dialog"
      activator="parent"
    >
      <v-card >
        <v-card width="400">
          <v-card-title>
            <span class="text-h5">Select an avatar</span>
          </v-card-title>
            <v-container >
              <label for="file-upload" class="custom-file-upload">
                <v-icon>mdi-cloud-upload</v-icon> Browse
              </label>
              <input id="file-upload" type="file" ref="file" v-on:change="handleFileUpload()"/>
            </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
        
            <v-btn
              color="primary"
              text
              @click="submitFile"
            >
              Save
            </v-btn>
          <v-btn color="primary" text @click="dialog = false">I changed my mind</v-btn>
          </v-card-actions>
        </v-card>
        
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
    file: "",
  }),

  methods: {
    ...mapGetters(['username', 'avatar', 'id']),

    submitFile(){
      let formData = new FormData();
      formData.append('file', this.file);
      axios.post( '/users/' + this.id() +'/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() =>{
          window.location.reload();
        })
        .catch(function(){
        });
      },
      // Handles a change on the file upload
      handleFileUpload(){
        this.file = (this.$refs as any).file.files[0];
      },
    },
});
</script>

<style scoped>
input[type="file"] {
    display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 15px 25px;
  cursor: pointer;
}
</style>