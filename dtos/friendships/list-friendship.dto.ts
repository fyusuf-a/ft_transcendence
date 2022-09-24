import { FriendshipDto } from './friendship.dto';
import { ResponseFriendshipDto } from './response-friendship.dto';
import { ListUserDto } from '../users/list-user.dto';

export class ListFriendshipDto extends FriendshipDto {
  constructor(base: ResponseFriendshipDto, user: ListUserDto) {
    super();
    this.id = base.id;
    this.sourceId = base.sourceId;
    this.targetId = base.targetId;
    this.status = base.status;
    this.user = user;
  }
  user!: ListUserDto;
}
