import { Socket } from 'socket.io-client';
import { ChannelDto } from '@dtos/channels';
import { MembershipDto } from '@dtos/memberships';
import { MessageDto } from '@dtos/messages';
import { ResponseUserDto, UserDto } from '@dtos/users';

export interface ChatStoreState {
  user: ResponseUserDto;
  token: string | undefined;
  connected: boolean;
  socket: Socket | undefined;
  channels: Array<ChannelDto>;
  memberships: Array<MembershipDto>;
  allChannels: Map<number, ChannelDto>;
  subscribedChannels: Array<ChannelDto>;
  messages: Map<number, Array<MessageDto>>;
}

export const state: ChatStoreState = {
  user: new UserDto(),
  token: undefined,
  connected: false,
  socket: undefined,
  channels: [],
  allChannels: new Map(),
  subscribedChannels: [],
  messages: new Map(),
  memberships: [],
};
