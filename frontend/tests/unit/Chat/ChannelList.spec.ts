import ChannelList from '@/components/Chat/ChannelList.vue';
import { myMount } from '@tests/vuetify-test';

describe('ChannelList.vue', () => {
  it('renders props', async () => {
    const channels = [
      { id: 1, name: 'Channel1' },
      { id: 2, name: 'Channel2' },
    ];
    const allChannels = new Map();
    const unreadChannels = new Set();
    const wrapper = myMount(ChannelList, {
      propsData: { channels, allChannels, unreadChannels },
    });
    await wrapper.setData({ title: 'ChannelsTitle' });
    expect(wrapper.text()).to.include('ChannelsTitle');
    for (const chan of channels) {
      expect(wrapper.text()).to.include(chan.name);
    }
  });
});
