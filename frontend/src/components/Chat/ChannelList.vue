<template>
  <v-card>
    <v-container>
      <v-row no-gutters align="center" class="header-row">
        <v-col cols="6">{{ title }}</v-col>
        <v-col cols="3">
          <channel-join-dialog
            @channel-join-event="handleChannelJoin"
            @channel-create-event="handleChannelCreate"
            @chat-dm-user="$emit('chat-dm-user')"
            :joinableChannels="getJoinableChannels"
          >
          </channel-join-dialog>
        </v-col>
        <v-col cols="3">
          <span
            icon
            color="primary"
            dark
            class="button"
            @click="$emit('refresh-channels-event')"
            >&#8635;
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
      <v-row>
        <v-col>
          <v-list density="compact">
            <v-list-item
              v-for="(item, i) in channels"
              :key="i"
              active-color="primary"
              @click="() => handleChannelSelection(item)"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ props: tooltip }">
                  <v-icon
                    v-bind="tooltip"
                    v-if="unreadChannels.has(item.id)"
                    color="secondary"
                    >{{ unreadMarker }}</v-icon
                  >
                  <v-list-item-title v-bind="tooltip">
                    <v-list-item-title>
                      {{ getChannelDisplay(item) }}
                    </v-list-item-title>
                  </v-list-item-title>
                </template>
                <span>{{ getChannelDisplay(item) }}</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { ChannelDto, CreateChannelDto } from '@/common/dto/channel.dto';
import { defineComponent, PropType } from 'vue';
import ChannelJoinDialog from './ChannelJoinDialog.vue';
import { UserDto } from '@/common/dto/user.dto';
import { JoinChannelDto } from '@dtos/channels/join-channel.dto';

interface DataReturnType {
  title: string;
  unreadMarker: string;
}

export default defineComponent({
  props: {
    channels: {
      type: Array as () => Array<ChannelDto>,
      required: true,
    },
    users: {
      type: Map,
      required: true,
    },
    allChannels: {
      type: Map as PropType<Map<number, ChannelDto>>,
      required: true,
    },
    unreadChannels: {
      type: Set, //Set<number>,
      required: true,
    },
  },
  data(): DataReturnType {
    return {
      title: 'Channels',
      unreadMarker: 'mdi-new-box',
    };
  },
  components: { 'channel-join-dialog': ChannelJoinDialog },
  methods: {
    async handleChannelSelection(channel: ChannelDto) {
      this.$emit('channel-select-event', channel);
    },
    handleChannelJoin(channel: JoinChannelDto) {
      this.$emit('channel-join-event', channel);
    },
    handleChannelCreate(dto: CreateChannelDto) {
      this.$emit('channel-create-event', dto);
    },
    getUsername(userId: number): string {
      const user = this.users.get(userId) as UserDto;
      if (user) {
        return user.username;
      }
      this.$emit('request-user-event', userId);
      return '...';
    },
    getChannelDisplay(channel: ChannelDto): string {
      if (channel.type !== 'direct') return channel.name;
      else if (
        channel.type === 'direct' &&
        this.$store.getters.id !== channel.userOneId
      )
        return this.getUsername(channel.userOneId as number);
      else if (
        channel.type === 'direct' &&
        this.$store.getters.id !== channel.userTwoId
      )
        return this.getUsername(channel.userTwoId as number);
      return 'UNKNOWN CHANNEL';
    },
  },
  computed: {
    getJoinableChannels(): ChannelDto[] {
      const allChannels = this.allChannels;
      return Array.from(allChannels.values())
        .filter((chan) => chan.type === 'public' || chan.type === 'protected')
        .filter((chan) => !this.channels.includes(chan)) as ChannelDto[];
    },
  },
});
</script>

<style>
.header-row {
  height: 75px;
}
</style>
