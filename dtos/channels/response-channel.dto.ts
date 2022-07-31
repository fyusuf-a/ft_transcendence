import { PickType } from '@nestjs/mapped-types';
import { ChannelDto } from './channel.dto';

export class ResponseChannelDto extends PickType(ChannelDto, [
  'id',
  'name',
  'type',
]) {}
