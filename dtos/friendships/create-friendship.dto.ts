import { OmitType } from '@nestjs/swagger';
import { FriendshipDto } from './friendship.dto';

export class CreateFriendshipDto extends OmitType(FriendshipDto, [
  'id',
  'status',
]) {}
