<script lang="ts">
import Vue from "vue";
import { ChannelDto } from "../../common/dto/channel.dto";

export default Vue.extend({
  props: {
    title: String,
    channels: Object as () => Array<ChannelDto>,
  },
  data() {
    return {
      selectedChannel: undefined,
      unreadChannels: new Set(),
      unreadMarker: "mdi-new-box",
    };
  },
  methods: {
    async handleChannelSelection(event: number) {
      console.log("Handling a channel selection");
      this.$emit("channel-select-event", this.channels[event]);
    },
  },
});
</script>

<template>
  <v-card class="mx-auto float-right" max-width="300">
    <v-list dense>
      <v-subheader>{{ title }}</v-subheader>
      <v-list-item-group
        v-model="selectedChannel"
        color="primary"
        @change="handleChannelSelection($event)"
      >
        <v-list-item v-for="(item, i) in channels" :key="i">
          <v-list-item-icon>
            <v-icon v-if="unreadChannels.has(item.id)" color="secondary">{{
              unreadMarker
            }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>
