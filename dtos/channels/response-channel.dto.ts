import { PickType } from '@nestjs/swagger';
import { ChannelDto } from './channel.dto';

export class ResponseChannelDto extends PickType(ChannelDto, [
  'id',
  'name',
  'type',
  'password',
]) {}
