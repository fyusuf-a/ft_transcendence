import { PickType } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class CreateMessageDto extends PickType(MessageDto, [
  'channelId',
  'content',
  'senderId',
]) {}
