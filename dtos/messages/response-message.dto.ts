import { PickType } from '@nestjs/mapped-types';
import { MessageDto } from './message.dto';

export class ResponseMessageDto extends PickType(MessageDto, [
  'id',
  'channelId',
  'senderId',
  'content',
  'createdAt',
]) {}
