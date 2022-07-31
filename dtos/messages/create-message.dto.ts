import { PickType } from '@nestjs/mapped-types';
import { MessageDto } from './message.dto';

export class CreateMessageDto extends PickType(MessageDto, [
  'channelId',
  'content',
  'senderId',
]) {}
