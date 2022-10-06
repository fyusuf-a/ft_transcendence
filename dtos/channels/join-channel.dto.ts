import { PickType } from '@nestjs/swagger';
import { ChannelDto } from './channel.dto';

export class JoinChannelDto extends PickType(ChannelDto, ['id', 'password']) {}
