import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class StatusUpdateDto extends PickType(UserDto, ['id', 'status']) {}
