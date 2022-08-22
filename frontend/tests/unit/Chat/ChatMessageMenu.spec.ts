import ChatMessageMenu from '@/components/Chat/ChatMessageMenu.vue';
import { myMount } from '@tests/vuetify-test';

describe('ChatMessageMenu.vue', () => {
  it('renders regular options', () => {
    const targetId = 1;
    const wrapper = myMount(ChatMessageMenu, {
      propsData: { targetId },
    });
    expect(wrapper.text()).to.include('Profile');
    expect(wrapper.text()).to.include('Challenge');
    expect(wrapper.text()).not.to.include('Ban');
  });

  it('renders admin options, if isAdmin === true', () => {
    const targetId = 1;
    const wrapper = myMount(ChatMessageMenu, {
      propsData: {
        targetId,
        clientIsAdmin: true,
      },
    });
    expect(wrapper.text()).to.include('Profile');
    expect(wrapper.text()).to.include('Challenge');
    expect(wrapper.text()).to.include('Ban');
  });
});
