<template>
  <v-dialog v-model="changingLocal">
    <v-card v-if="selectedChannel !== undefined" class="v-dialog-pos">
      <v-toolbar color="primary">
        <v-toolbar-title class="mx-10">
          Change/Set password for <u>{{ selectedChannel.name }}</u>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-model="password"
          label="Password (Leave blank to make this channel public)"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red" text @click="resetDialog"> Cancel </v-btn>
        <v-btn color="success" text @click="setPassword"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { ChannelDto } from '@/common/dto/channel.dto';
import { ChannelType, UpdateChannelDto } from '@dtos/channels';

interface DataReturnType {
  password: string;
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
    },
  },
  data(): DataReturnType {
    return {
      password: '',
    };
  },
  methods: {
    async handleInvite(userId: number) {
      this.$emit('chat-invite-user', userId);
      this.resetDialog();
    },
    resetDialog() {
      this.password = '';
      this.$emit('update:modelValue', false);
    },
    setPassword() {
      if (!this.selectedChannel) return;
      let data: UpdateChannelDto = {
        password: this.password,
        type: ChannelType.PROTECTED,
      };
      if (this.password.length === 0) {
        data = {
          type: ChannelType.PUBLIC,
        };
      }
      axios
        .patch('/channels/' + this.selectedChannel?.id, data)
        .then(() => {
          window.alert('Successfully updated password!');
        })
        .catch(() => {
          window.alert('Could not update password!');
        });
      this.resetDialog();
    },
  },
  computed: {
    changingLocal: {
      get(): boolean {
        return this.modelValue;
      },
      set(value: boolean) {
        this.$emit('update:modelValue', value);
      },
    },
  },
});
</script>
