<script lang="ts">
import { ChannelDto } from "../common/dto/channel.dto";
import Vue from "vue";
import ChannelsList from "../components/Chat/ChannelsList.vue";

declare interface DataType {
  channels?: Array<ChannelDto>;
  selectedChannel?: ChannelDto;
}

export default Vue.extend({
  data(): DataType {
    return {
      channels: undefined,
      selectedChannel: undefined,
    };
  },
  components: { ChannelsList },
  methods: {
    handleChannelSelection(newChannel: ChannelDto) {
      this.selectedChannel = newChannel;
      console.log(`parent says: ${this.selectedChannel.name}`);
    },
    getAllChannels() {
      console.log("Vue: Grabbing channels");
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", "http://localhost:8080/channels", false);
      xhttp.setRequestHeader(
        "Authorization",
        `bearer ${this.$store.state.user.token}`
      );
      xhttp.send();
      console.log(xhttp.responseText);
      this.channels = JSON.parse(xhttp.responseText).data;
    },
  },
  mounted() {
    this.getAllChannels();
  },
});
</script>

<template>
  <div>
    Chat
    <channels-list
      @channel-select-event="handleChannelSelection"
      title="CUSTOM NAME"
      :channels="channels"
    ></channels-list>
  </div>
</template>
