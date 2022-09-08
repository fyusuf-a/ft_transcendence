import { FriendshipDto } from './friendship.dto';
import { ResponseFriendshipDto } from './response-friendship.dto';
import { UpdateUserDto } from '../users/update-user.dto';

export class ListFriendshipDto extends FriendshipDto {
  constructor(base: ResponseFriendshipDto, user: UpdateUserDto) {
    super();
    this.id = base.id;
    this.sourceId = base.sourceId;
    this.targetId = base.targetId;
    this.status = base.status;
    this.user = user;
  }
  user!: UpdateUserDto;
}
