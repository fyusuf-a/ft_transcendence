import { PickType } from '@nestjs/swagger';
import { UserDto } from '@dtos/users';

export class TokenUserDto extends PickType(UserDto, ['id', 'username']) {}
