import { PickType } from "@nestjs/swagger";
import { MessageDto } from "./message.dto";

export class ResponseMessageDto extends PickType(MessageDto, [
  'id',
  'channelId',
  'senderId',
  'content',
]) {}
