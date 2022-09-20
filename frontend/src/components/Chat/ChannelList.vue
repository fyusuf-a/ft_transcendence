<template>
  <v-card>
    <v-container>
      <v-row no-gutters align="center" class="header-row">
        <v-col cols="11">{{ title }}</v-col>
        <v-col cols="1">
          <channel-join-dialog
            @channel-join-event="handleChannelJoin"
            @channel-create-event="handleChannelCreate"
            :joinableChannels="getJoinableChannels"
          >
          </channel-join-dialog>
        </v-col>
        <v-spacer></v-spacer>
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
                      <v-list-item-title> {{ item.name }}</v-list-item-title>
                    </v-list-item-title>
                  </template>
                  <span>{{ item.name }}</span>
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
  components: { 'channel-join-dialog': defineComponent(ChannelJoinDialog) },
  methods: {
    async handleChannelSelection(channel: ChannelDto) {
      console.log(`Handling a channel selection: ${channel.id}`);
      this.$emit('channel-select-event', channel);
    },
    handleChannelJoin(channelId: number) {
      this.$emit('channel-join-event', channelId);
    },
    handleChannelCreate(dto: CreateChannelDto) {
      this.$emit('channel-create-event', dto);
    }
  },
  computed: {
    getJoinableChannels(): ChannelDto[] {
      return Array.from(this.allChannels.values()).filter(
        (chan) => !this.channels.includes(chan),
      ) as ChannelDto[];
    },
  },
});
</script>

<style>
  .header-row {
    height: 75px;
  }
</style>
