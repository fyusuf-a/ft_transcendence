import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PickType(PartialType(UserDto), [
  'username',
  'avatar',
]) {}
