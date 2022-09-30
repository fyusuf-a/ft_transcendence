<template>
    <v-dialog
        v-model="invitingLocal"
    >
        <v-card v-if="selectedChannel !== undefined">
            <v-card-title> Add User to <u>{{ selectedChannel.name }}</u></v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="username"
                    label="Username"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" text @click="resetDialog"> Cancel </v-btn>
                <v-btn color="primary" text @click="handleInvite">
                    Add
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts">
  import axios from 'axios';
  import { defineComponent } from 'vue';
  import { ChannelDto } from '@/common/dto/channel.dto';
  interface DataReturnType {
    username: string;
  }
  
  export default defineComponent({
    props: {
      selectedChannel: {
        type: Object as () => ChannelDto,
        required: false,
      },
      modelValue: {
        type: Boolean,
        required: true,
      }
    },
    data(): DataReturnType {
      return {
        username: '',
      };
    },
    methods: {
      async handleInvite() {
        this.resetDialog();
      },
      resetDialog() {
        this.username = '';
        this.$emit('update:modelValue', false);
      },
    },
    computed: {
      invitingLocal: {
        get(): boolean {
          return this.modelValue;
        },
        set(value: boolean) {
          this.$emit('update:modelValue', value);
        }
      } 
    }
  });
  </script>
  