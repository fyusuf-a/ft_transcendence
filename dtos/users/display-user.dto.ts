import { PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class DisplayUserDto extends PickType(PartialType(UserDto), [
  'username',
  'avatar',
  'id',
]) {}
