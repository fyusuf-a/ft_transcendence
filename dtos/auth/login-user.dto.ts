import { PickType } from '@nestjs/swagger';
import { UserDto } from '@dtos/users';

export class LoginUserDto extends PickType(UserDto, ['username']) {}
