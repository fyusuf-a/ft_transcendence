<script lang="ts">
import Vue from "vue";
import { CreateChannelDto } from "../../common/dto/channel.dto";

declare interface DataReturnType {
  selectedChannel: string;
  dialogOpen: boolean;
  action: string;
  createdChannel: CreateChannelDto;
  channelTypes: Array<string>;
}

export default Vue.extend({
  props: {
    joinableChannels: Array,
  },
  data(): DataReturnType {
    return {
      selectedChannel: "",
      dialogOpen: false,
      action: "Join",
      createdChannel: { name: "", type: "", password: "" },
      channelTypes: ["public", "protected", "private"],
    };
  },
  methods: {
    async createChannel(channelObject: CreateChannelDto): Promise<number> {
      let rawResponse = await fetch("http://localhost:8080/channels", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${this.$store.state.user.token}`,
        },
        body: JSON.stringify({
          name: channelObject.name,
          type: channelObject.type,
          password: channelObject.password,
        }),
      });
      console.log(rawResponse);
      if (rawResponse.status === 201) {
        const response = await rawResponse.json();
        console.log(response);
        return response.id;
      }
      return -1;
    },
    async handleJoinChannel() {
      if (this.action == "Join") {
        this.$emit("channel-join-event", this.selectedChannel);
      } else {
        console.log("Created:");
        if (!this.createdChannel.name || !this.createdChannel.type) {
          console.log("Invalid channel dto");
        } else {
          let dto = new CreateChannelDto(
            this.createdChannel.name,
            this.createdChannel.type
          );
          if (this.createdChannel.password) {
            dto.password = this.createdChannel.password;
          }
          const createdChannelId: number = await this.createChannel(dto);
          if (createdChannelId > 0) {
            console.log("Joining new channel");
            this.$emit("channel-join-event", createdChannelId.toString());
          }
        }
      }
      this.dialogOpen = false;
      this.action = "Join";
    },
    resetDialog() {
      this.dialogOpen = false;
      this.action = "Join";
      this.createdChannel = {
        name: "",
        type: "",
        password: "",
      };
    },
  },
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialogOpen" scrollable max-width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="primary" dark v-bind="attrs" v-on="on"> + </v-btn>
      </template>
      <v-card>
        <v-card-title
          >{{ action }} Channel
          <v-spacer></v-spacer>
          <v-btn
            v-if="action == 'Join'"
            icon
            color="primary"
            dark
            @click="action = 'Create'"
          >
            +
          </v-btn></v-card-title
        >

        <v-divider></v-divider>
        <v-card-text v-if="action == 'Create'">
          <v-text-field
            v-model="createdChannel.name"
            label="Channel Name"
          ></v-text-field>
          <v-select
            v-model="createdChannel.type"
            :items="channelTypes"
            label="Type"
          ></v-select>
          <v-text-field
            v-model="createdChannel.password"
            label="Password"
          ></v-text-field>
        </v-card-text>
        <v-card-text v-else style="height: 300px">
          <v-radio-group v-model="selectedChannel" column>
            <v-radio
              v-for="channel in joinableChannels"
              :label="channel.name"
              :value="channel.id"
              @dblclick="handleJoinChannel"
              :key="channel.id"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red" text @click="resetDialog"> Cancel </v-btn>
          <v-btn color="primary" text @click="handleJoinChannel">
            {{ action }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
