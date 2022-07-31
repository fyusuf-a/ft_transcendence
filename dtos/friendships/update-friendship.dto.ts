import { OmitType } from '@nestjs/mapped-types';
import { FriendshipDto } from './friendship.dto';

export class UpdateFriendshipDto extends OmitType(FriendshipDto, [
  'id',
  'sourceId',
  'targetId',
]) {}
