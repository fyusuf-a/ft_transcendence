import { OmitType } from '@nestjs/swagger';
import { ChannelDto } from './channel.dto';

export class ResponseChannelDto extends OmitType(ChannelDto, [
  'messages',
  'messageIds',
  'karmas',
]) {}
