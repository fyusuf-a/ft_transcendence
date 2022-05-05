import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ResponseUserDto extends OmitType(UserDto, [
  'avatar',
  'friends',
  'blocked',
  'blockedIds',
]) {}
