import { ChannelType } from '../entities/channel.entity';

export class MockChannelEntity {
  id = 1;
  name = 'channel-name';
  type: ChannelType = ChannelType.PRIVATE;
  password?: string = null;
  ownerId = 1;
  adminIds: number[] = [];
  paricipantIds: number[] = [];
  messageIds: number[] = [];
}
