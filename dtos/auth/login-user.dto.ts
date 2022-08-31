import { PickType } from '@nestjs/mapped-types';
import { UserDto } from '@dtos/users';

export class LoginUserDto extends PickType(UserDto, ['id']) {}
