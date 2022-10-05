<template>
  <v-dialog v-model="karmaLocal">
    <v-card v-if="selectedChannel !== undefined">
      <v-card-title> {{ modelValue }} for </v-card-title>

      <v-card-text>
        <v-text-field v-model="hours" label="hours"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red" text @click="resetDialog"> Cancel </v-btn>
        <v-btn color="success" text @click="handleKarma"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChannelDto } from '@/common/dto/channel.dto';

interface DataReturnType {
  hours: string;
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
    socket: {
      type: Object,
      required: true,
    },
  },
  data(): DataReturnType {
    return {
      hours: '',
    };
  },
  methods: {
    async handleKarma() {
      const hours: number = parseInt(this.hours);
      const minutes = hours * 60;
      const seconds = minutes * 60;
      const duration = seconds * 1000;
      if (isNaN(hours) || hours < 0) {
        window.alert('Please enter a valid number!');
        return;
      }
      let datetime = new Date(Date.now());
      datetime.setTime(datetime.getTime() + seconds * 1000);
      this.socket.emit(
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
      this.hours = '';
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
