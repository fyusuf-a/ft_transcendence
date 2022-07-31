import { OmitType } from '@nestjs/mapped-types';
import { FriendshipDto } from './friendship.dto';

export class CreateFriendshipDto extends OmitType(FriendshipDto, [
  'id',
  'status',
]) {}
