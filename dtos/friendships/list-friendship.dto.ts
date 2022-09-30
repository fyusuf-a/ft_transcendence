import { FriendshipDto } from './friendship.dto';
import { ResponseFriendshipDto } from './response-friendship.dto';
import { DisplayUserDto } from '../users/display-user.dto';

export class ListFriendshipDto extends FriendshipDto {
  constructor(base: ResponseFriendshipDto, user: DisplayUserDto) {
    super();
    this.id = base.id;
    this.sourceId = base.sourceId;
    this.targetId = base.targetId;
    this.status = base.status;
    this.user = user;
  }
  user!: DisplayUserDto;
}
