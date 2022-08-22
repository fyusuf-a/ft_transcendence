import { PickType } from '@nestjs/mapped-types';
import { ChannelDto } from './channel.dto';

export class CreateChannelDto extends PickType(ChannelDto, [
  'name',
  'type',
  'password',
  'userOneId',
  'userTwoId',
]) {}
