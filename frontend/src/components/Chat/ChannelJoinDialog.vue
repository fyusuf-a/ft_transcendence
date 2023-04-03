<template>
  <v-row justify="center">
    <v-btn @click="openDialog" icon>+</v-btn>
    <v-dialog v-model="dialogOpen" scrollable max-width="300px">
      <v-card class="v-dialog-pos">
        <v-card-title
          >{{ action }} Channel
          <v-spacer></v-spacer>
          <v-btn
            v-if="action == 'Join'"
            icon
            color="primary"
            dark
            @click="action = 'Create'"
          >
            +
          </v-btn>
          <v-btn @click="dmUser">DM</v-btn></v-card-title
        >

        <v-divider></v-divider>
        <v-card-text v-if="action == 'Create'">
          <v-text-field
            v-model="createdChannel.name"
            label="Channel Name"
          ></v-text-field>
          <v-select
            v-model="createdChannel.type"
            :items="channelTypes"
            label="Type"
          ></v-select>
          <v-text-field
            v-if="createdChannel.type === 'protected'"
            v-model="createdChannel.password"
            label="Password"
          ></v-text-field>
        </v-card-text>
        <v-card-text v-else style="height: 300px">
          <v-radio-group v-model="selectedChannel" column>
            <v-radio
              v-for="channel in joinableChannels"
              :label="channel.name"
              :value="channel.id"
              @dblclick="handleJoinChannel"
              :key="channel.id"
            ></v-radio>
          </v-radio-group>
          <v-text-field
            v-if="selectedChannel"
            v-model="password"
            label="Password"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red" text @click="resetDialog"> Cancel </v-btn>
          <v-btn color="primary" text @click="handleJoinChannel">
            {{ action }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChannelDto, CreateChannelDto } from '@/common/dto/channel.dto';
import { chatStore } from '@/store/chat';
interface DataReturnType {
  joinableChannels: Array<ChannelDto>;
  selectedChannel: string;
  dialogOpen: boolean;
  action: string;
  createdChannel: CreateChannelDto;
  channelTypes: Array<string>;
  password?: string;
}

export default defineComponent({
  data(): DataReturnType {
    return {
      joinableChannels: [],
      selectedChannel: '',
      dialogOpen: false,
      action: 'Join',
      createdChannel: { name: '', type: 'public', password: '' },
      channelTypes: ['public', 'protected', 'private'],
      password: undefined,
    };
  },
  watch: {
    dialogOpen(newValue, oldValue) {
      if (oldValue === true && newValue === false) {
        this.resetDialog();
      }
    },
  },
  methods: {
    async handleJoinChannel() {
      if (this.action == 'Join') {
        this.$emit('channel-join-event', {
          id: this.selectedChannel,
          password: this.password,
        });
        this.password = undefined;
      } else if (this.createdChannel.name && this.createdChannel.type) {
        let dto = new CreateChannelDto(
          this.createdChannel.name,
          this.createdChannel.type,
        );
        if (this.createdChannel.password) {
          dto.password = this.createdChannel.password;
        }
        this.$emit('channel-create-event', dto);
      }
      this.resetDialog();
    },
    openDialog() {
      this.dialogOpen = true;
      chatStore
        .dispatch('fetchJoinableChannels')
        .then((channels: Array<ChannelDto>) => {
          this.joinableChannels = [...channels];
        })
        .catch((error: Error) => {
          console.log(error);
        });
    },
    resetDialog() {
      this.selectedChannel = '';
      this.dialogOpen = false;
      this.action = 'Join';
      this.createdChannel = {
        name: '',
        type: 'public',
        password: '',
      };
    },
    dmUser() {
      this.$emit('chat-dm-user');
      this.dialogOpen = false;
    },
  },
});
</script>
