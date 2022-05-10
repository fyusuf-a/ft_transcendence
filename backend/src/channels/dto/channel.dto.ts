import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { Karma } from "../../karmas/entities/karma.entity";
import { Message } from "../../messages/message.entity";
import { User } from "../../users/entities/user.entity";
import { ChannelType } from "../entities/channel.entity";

export class ChannelDto {
  @ApiProperty({
    description: 'The id of a channel',
  })
  @IsPositive()
  @IsInt()
  id: number;
  
  @ApiProperty({
    description: 'The unique channel name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The channel type',
  })
  type: ChannelType;

  @ApiProperty({
    description: 'A password for the channel',
  })
  password?: string;

  owner: User;
  ownerId: number;

  admins: User[];
  adminIds: number[];

  participants: User[];
  paricipantIds: number[];

  messages: Message[];
  messageIds: number[];

  karmas: Karma[];
}
