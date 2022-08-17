import ChannelJoinDialog from '@/components/Chat/ChannelJoinDialog.vue';
import { myMount } from '@tests/vuetify-test';

describe('ChannelJoinDialog.vue', () => {
  it('renders Join Channel', () => {
    const joinableChannels = [
      {
        id: 1,
        name: 'ChannelName',
      },
    ];
    const wrapper = myMount(ChannelJoinDialog, {
      propsData: {
        joinableChannels: joinableChannels,
      },
    });
    expect(wrapper.text()).to.include('Join Channel');
  });

  it('renders Create Channel when toggled', async () => {
    const joinableChannels = [
      {
        id: 1,
        name: 'ChannelName',
      },
    ];
    const wrapper = myMount(ChannelJoinDialog, {
      propsData: { joinableChannels },
    });
    await wrapper.setData({ action: 'Create' });
    expect(wrapper.text()).to.include('Create Channel');
  });
});
