<template>
  <v-dialog v-model="karmaLocal">
    <v-card v-if="selectedChannel !== undefined" class="v-dialog-pos">
      <v-toolbar color="primary">
        <v-toolbar-title> {{ modelValue }} for </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="karmaTime" label="minutes"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" text @click="resetDialog"> Cancel </v-btn>
        <v-btn color="success" text @click="handleKarma"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChannelDto } from '@/common/dto/channel.dto';
import { chatStore } from '@/store/chat';

interface DataReturnType {
  karmaTime: string;
}

export default defineComponent({
  props: {
    selectedChannel: {
      type: Object as () => ChannelDto,
      required: false,
    },
    selectedUser: {
      type: Number,
      required: false,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  data(): DataReturnType {
    return {
      karmaTime: '',
    };
  },
  methods: {
    async handleKarma() {
      const karmaTime: number = parseInt(this.karmaTime);
      const duration = karmaTime * 60 * 1000;
      if (isNaN(karmaTime) || karmaTime < 0) {
        window.alert('Please enter a valid number!');
        return;
      }
      let datetime = new Date(Date.now());
      datetime.setTime(datetime.getTime() + duration);
      chatStore.state.socket?.emit(
        'chat-karma-user',
        {
          userId: this.selectedUser,
          channelId: this.selectedChannel?.id,
          duration: duration,
          type: this.modelValue,
        },
        (response: string) => {
          window.alert(response);
        },
      );
      this.resetDialog();
    },
    resetDialog() {
      this.karmaTime = '';
      this.$emit('update:modelValue', '');
    },
  },
  computed: {
    karmaLocal: {
      get(): boolean {
        return this.modelValue !== '';
      },
      set(value: boolean) {
        if (value === false) this.$emit('update:modelValue', '');
      },
    },
  },
});
</script>
