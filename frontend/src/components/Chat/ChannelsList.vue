<script lang="ts">
import Vue from "vue";

import ChannelJoinDialog from "./ChannelJoinDialog.vue";

export default Vue.extend({
  props: {
    title: String,
    channels: Array,
    allChannels: Map,
    unreadChannels: Set,
  },
  data() {
    return {
      selectedChannel: undefined,
      unreadMarker: "mdi-new-box",
    };
  },
  components: { ChannelJoinDialog },
  methods: {
    async handleChannelSelection(event: number) {
      console.log("Handling a channel selection");
      this.$emit("channel-select-event", this.channels[event]);
    },
    handleChannelJoin(channelId: number) {
      this.$emit("channel-join-event", channelId);
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
            @channel-join-event="(channelId) => handleChannelJoin(channelId)"
            :joinableChannels="Array.from(allChannels.values())"
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
                <v-list-item-icon>
                  <v-icon
                    v-if="unreadChannels.has(item.id)"
                    color="secondary"
                    >{{ unreadMarker }}</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
