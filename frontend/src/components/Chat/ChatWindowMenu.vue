<template>
  <v-menu bottom left>
    <template v-slot:activator="{ props: tooltip }">
      <v-btn light icon v-bind="tooltip">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
        <v-list-item v-for="(item, i) in allowedOptions" :key="i" active-color="primary" @click="() => handleOptionSelection(item)">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { ChannelDto } from '@/common/dto/channel.dto';
import { MembershipDto } from '@/common/dto/membership.dto';
import { MembershipRoleType } from '@dtos/memberships';
import { defineComponent, PropType } from 'vue';
import { ChannelType } from '@dtos/channels';

declare interface OptionType {
  label: string;
  event: string;
}

export default defineComponent({
  props: {
    channel: {
      type: Object as PropType<ChannelDto>,
      required: true,
    },
    membership: {
      type: Object as PropType<MembershipDto>,
      required: true,
    },
  },
  data() {
    return {
      selectedOption: -1,
    };
  },
  methods: {
    handleOptionSelection(item: OptionType) {
      this.$emit(item.event);
    },
  },
  computed: {
    allowedOptions(): OptionType[] {
      let options = [];
      let optionLabel = 'Leave Channel';
      if (this.channel.type === ChannelType.DIRECT || this.membership?.role === MembershipRoleType.OWNER) {
        optionLabel = 'Delete Channel';
      }
      options.push({ label: optionLabel, event: 'chat-leave-channel' });
      return options;
    },
  },
});
</script>
