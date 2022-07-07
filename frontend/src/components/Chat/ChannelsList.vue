<script lang="ts">
import { ChannelDto } from "@/common/dto/channel.dto";
import Vue from "vue";

import ChannelJoinDialog from "./ChannelJoinDialog.vue";

declare interface DataReturnType {
  selectedChannel?: number;
  unreadMarker: string;
}

export default Vue.extend({
  props: {
    title: String,
    channels: Array, //<ChannelDto>,
    allChannels: Map, //<number, ChannelDto>,
    unreadChannels: Set, //<number>,
  },
  data(): DataReturnType {
    return {
      selectedChannel: -1,
      unreadMarker: "mdi-new-box",
    };
  },
  components: { "channel-join-dialog": Vue.extend(ChannelJoinDialog) },
  methods: {
    async handleChannelSelection(channelId: number) {
      console.log("Handling a channel selection");
      this.$emit("channel-select-event", this.channels[channelId]);
    },
    handleChannelJoin(channelId: number) {
      this.selectedChannel = this.channels.length;
      this.$emit("channel-join-event", channelId);
    },
  },
  computed: {
    getJoinableChannels(): ChannelDto[] {
      return Array.from(this.allChannels.values()).filter(
        (chan) => !this.channels.includes(chan)
      ) as ChannelDto[];
    },
  },
});
</script>

<template>
  <v-card>
    <v-container>
      <v-row no-gutters align="center">
        <v-col cols="10">{{ title }}</v-col>
        <v-col cols="1">
          <channel-join-dialog
            @channel-join-event="handleChannelJoin"
            :joinableChannels="getJoinableChannels"
          ></channel-join-dialog>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
      <v-row>
        <v-col>
          <v-list dense>
            <v-list-item-group
              v-model="selectedChannel"
              color="primary"
              @change="handleChannelSelection($event)"
            >
              <v-list-item v-for="(item, i) in channels" :key="i">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-icon v-bind="attrs" v-on="on">
                      <v-icon
                        v-if="unreadChannels.has(item.id)"
                        color="secondary"
                        >{{ unreadMarker }}</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content v-bind="attrs" v-on="on">
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <span>{{ item.name }}</span>
                </v-tooltip>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
