import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class TokenUserDto extends PickType(UserDto, ['id', 'username']) {}
