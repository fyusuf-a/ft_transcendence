<template>
	<v-card>
		<v-container>
			<v-row no-gutters align="center">
				<v-col cols="10">{{ title }}</v-col>
				<v-col cols="1">
					<channel-join-dialog @channel-join-event="handleChannelJoin"
						:joinableChannels="getJoinableChannels"></channel-join-dialog>
				</v-col>
				<v-spacer></v-spacer>
			</v-row>
			<v-row>
				<v-divider></v-divider>
			</v-row>
			<v-row>
				<v-col>
					<v-list :items="channels" item-title="name" item-value="id" @update:selected="handleChannelSelection">
					</v-list>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script lang="ts">
import { ChannelDto } from '@/common/dto/channel.dto';
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
		async handleChannelSelection(channelIds: string[]) {
			const channelId: number = +channelIds[0];
			console.log('Handling a channel selection');
			if (channelId) {
				console.log(channelId);
				// this.$emit('channel-select-event', this.channels[channelId]);
			} else {
				console.log('No channel selected');
			}
		},
		handleChannelJoin(channelId: number) {
			this.$emit('channel-join-event', channelId);
		},
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
