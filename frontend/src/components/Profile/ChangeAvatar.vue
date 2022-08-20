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
        <v-card width="500">
          <v-card-title>
            <span class="text-h5">Chose a file</span>
          </v-card-title>
          <v-card-text>
            <v-file-input
              accept="image/*"
              label="File input"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn
              color="primary"
              text
              @click="dialog = false"
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
  }),

  methods: {
    ...mapGetters(['username', 'avatar', 'id']),

  },

});
</script>
