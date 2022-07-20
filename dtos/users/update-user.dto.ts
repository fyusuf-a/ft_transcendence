import { PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PickType(PartialType(UserDto), [
  'username',
  'avatar',
]) {}
