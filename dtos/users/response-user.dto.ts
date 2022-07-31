import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class ResponseUserDto extends OmitType(UserDto, [
  'avatar',
  'membershipIds',
]) {}
