import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ListUserDto extends PickType(UserDto, [
  'username',
  'id',
  'status',
]) {}
