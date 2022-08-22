import { PickType } from '@nestjs/mapped-types';
import { UserDto } from '@dtos/users';

export class TokenUserDto extends PickType(UserDto, ['id', 'username']) {}
