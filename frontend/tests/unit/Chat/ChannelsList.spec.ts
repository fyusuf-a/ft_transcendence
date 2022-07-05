import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ChannelsList from "@/components/Chat/ChannelsList.vue";

describe("ChannelsList.vue", () => {
  it("renders props", () => {
    const props = {
      title: "ChannelTitle",
      channels: [
        { id: 1, name: "Channel1" },
        { id: 2, name: "Channel2" },
      ],
      allChannels: new Map(),
      unreadChannels: new Set(),
    };
    const wrapper = shallowMount(ChannelsList, {
      propsData: props,
    });
    expect(wrapper.text()).to.include(props.title);
    for (const chan of props.channels) {
      expect(wrapper.text()).to.include(chan.name);
    }
  });
});
