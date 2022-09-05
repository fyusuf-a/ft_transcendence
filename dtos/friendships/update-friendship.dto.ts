import { OmitType } from '@nestjs/swagger';
import { FriendshipDto } from './friendship.dto';

export class UpdateFriendshipDto extends OmitType(FriendshipDto, [
  'id',
  'sourceId',
  'targetId',
]) {}
