<template>
    <v-dialog
        v-model="invitingLocal"
    >
        <v-card>
            <v-card-title> DM User</v-card-title>

          <v-card-text>
              <v-text-field
                  v-model="query"
                  label="Username"
              ></v-text-field>
              <v-list v-if="query">
                <v-list-item
                  v-for="(user, i) in filteredList"
                  :key="user.id"
                  @click="handleInvite(user.id)"
                >
                  {{ user.username }}
                </v-list-item>
              </v-list>
            </v-card-text>
            
            <v-card-actions>
                <v-btn color="red" text @click="resetDialog"> Cancel </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts">
  import axios from 'axios';
  import { defineComponent } from 'vue';
  import { ChannelDto } from '@/common/dto/channel.dto';
  
  interface DataReturnType {
    query: string;
    users: { id: number, username: string }[];
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
        query: '',
        users: [],
      };
    },
    methods: {
      async handleInvite(userId: number) {
        this.$emit('chat-dm-user', userId);
        this.resetDialog();
      },
      resetDialog() {
        this.query = '';
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
      },
      filteredList() {
        console.log('checking filtered list');
        return this.users.filter((user) => {
          return user.username.toLowerCase().includes(this.query.toLowerCase());
        });
      },
    },
    async created() {
      let response = await axios.get('/users/');
      for (let i: number = 0; i < response.data.data.length; i++) {
        this.users.push({
          id: response.data.data[i].id,
          username: response.data.data[i].username,
        });
        console.log(response.data.data[i].username);
      };
      console.log('got users');
    },
  });
  </script>
