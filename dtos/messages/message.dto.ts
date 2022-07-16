import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ResponseChannelDto } from '@dtos/channels';
import { ResponseUserDto } from '@dtos/users';

export class MessageDto {
  @ApiProperty({
    description: 'The id of a message',
  })
  @IsPositive()
  @IsInt()
  id!: number;

  @ApiProperty({
    description: 'The contents of the message',
  })
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    description: 'The sender of the message',
  })
  sender!: ResponseUserDto;

  @ApiProperty({
    description: 'Id of the sender of the message',
  })
  @IsPositive()
  @IsInt()
  senderId!: number;

  @ApiProperty({
    description: 'The channel to which the message is sent',
  })
  channel!: ResponseChannelDto;

  @ApiProperty({
    description: 'Id of the channel to which the message is sent',
  })
  @IsPositive()
  @IsInt()
  channelId!: number;

  @ApiProperty({
    description: 'Time when the message was created',
  })
  @IsDate()
  createdAt!: Date;
}
