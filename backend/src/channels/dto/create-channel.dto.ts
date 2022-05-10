import { PickType } from '@nestjs/swagger';
import { ChannelDto } from './channel.dto';

export class CreateChannelDto extends PickType(ChannelDto, [
  'name',
  'type',
  'password',
]) {}
