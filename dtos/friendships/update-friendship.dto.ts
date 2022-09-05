import { OmitType } from '@nestjs/swagger';
import { FriendshipDto } from './friendship.dto';

export class UpdateFriendshipDto extends OmitType(FriendshipDto, [
  'sourceId',
  'targetId',
]) {}
