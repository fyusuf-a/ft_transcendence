import { OmitType } from "@nestjs/swagger";
import { ChannelDto } from "./channel.dto";

export class ResponseChannelDto extends OmitType(ChannelDto, [
  'admins',
  'adminIds',
  'owner',
  'ownerId',
  'participants',
  'paricipantIds',
  'messages',
  'messageIds',
  'karmas'
]) {}
