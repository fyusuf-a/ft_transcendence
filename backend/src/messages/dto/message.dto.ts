import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';

export class MessageDto {
  @ApiProperty({
    description: 'The id of a message',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The contents of the message',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The sender of the message',
  })
  sender: User;

  @IsPositive()
  @IsInt()
  senderId: number;

  @ApiProperty({
    description: 'The channel to which the message is sent',
  })
  channel: Channel;

  @IsPositive()
  @IsInt()
  channelId: number;
}
