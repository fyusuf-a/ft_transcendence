import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ChannelJoinDialog from "@/components/Chat/ChannelJoinDialog.vue";

describe("ChannelJoinDialog.vue", () => {
  it("renders props", async () => {
    const joinableChannels: number[] = [];
    const wrapper = shallowMount(ChannelJoinDialog, {
      propsData: { joinableChannels },
    });
    expect(wrapper.text()).to.include("Join Channel");

    await wrapper.setData({ action: "Create" });
    expect(wrapper.text()).to.include("Create Channel");
  });
});
