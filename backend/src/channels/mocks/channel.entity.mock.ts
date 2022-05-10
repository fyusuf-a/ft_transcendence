import { Karma } from 'src/karmas/entities/karma.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { ChannelType } from '../entities/channel.entity';

export class mockChannelEntity {
  id = 1;
  name = 'channel-name';
  type: ChannelType = ChannelType.PRIVATE;
  password?: string = null;
  ownerId = 1;
  adminIds: number[] = [];
  paricipantIds: number[] = [];
  messageIds: number[] = [];
}
