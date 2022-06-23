<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    joinableChannels: Array,
  },
  data() {
    return {
      dialogm1: "",
      dialog: false,
    };
  },
  methods: {
    handleJoinChannel() {
      this.$emit("channel-join-event", this.dialogm1);
      this.dialog = false;
    },
  },
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="primary" dark v-bind="attrs" v-on="on"> + </v-btn>
      </template>
      <v-card>
        <v-card-title>Select Channel</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-radio-group v-model="dialogm1" column>
            <v-radio
              v-for="channel in joinableChannels"
              :label="channel.name"
              :value="channel.id"
              @dblclick="handleJoinChannel"
              :key="channel.id"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red" text @click="dialog = false"> Cancel </v-btn>
          <v-btn color="primary" text @click="handleJoinChannel"> Join </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
