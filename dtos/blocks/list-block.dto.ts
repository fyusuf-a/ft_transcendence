import { BlockDto } from './block.dto';
import { UpdateUserDto } from '../users/update-user.dto';
import { FriendshipTypeEnum } from '@dtos/friendships';
import { PickType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';

export class ListBlockDto extends PickType (BlockDto, ["id", 'sourceId',
'targetId']) {
  constructor(base: BlockDto, user: UpdateUserDto) {
    super();
    this.id = base.id;
    this.sourceId = base.sourceId;
    this.targetId = base.targetId;
    this.user = user;
    this.status = FriendshipTypeEnum.PENDING;
  }
  user!: UpdateUserDto;
}
