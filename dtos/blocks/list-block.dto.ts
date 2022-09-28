import { BlockDto } from './block.dto';
import { ResponseBlockDto } from './response-block.dto';
import { DisplayUserDto } from '../users/display-user.dto';

export class ListBlockDto extends BlockDto {
  constructor(base: ResponseBlockDto, user: DisplayUserDto) {
    super();
    this.id = base.id;
    this.sourceId = base.sourceId;
    this.targetId = base.targetId;
    this.status = base.status;
    this.user = user;
  }
  user!: DisplayUserDto;
}
