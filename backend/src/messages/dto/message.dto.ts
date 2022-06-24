import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';

export class MessageDto {
  @Expose()
  @ApiProperty({
    description: 'The id of a message',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The contents of the message',
  })
  @IsNotEmpty()
  content: string;

  @Exclude()
  @ApiProperty({
    description: 'The sender of the message',
  })
  sender: User;

  @Expose()
  @ApiProperty({
    description: 'Id of the sender of the message',
  })
  @IsPositive()
  @IsInt()
  senderId: number;

  @Exclude()
  @ApiProperty({
    description: 'The channel to which the message is sent',
  })
  channel: Channel;

  @Expose()
  @ApiProperty({
    description: 'Id of the channel to which the message is sent',
  })
  @IsPositive()
  @IsInt()
  channelId: number;

  @Expose()
  @ApiProperty({
    description: 'Time when the message was created',
  })
  @IsDate()
  createdAt: Date;
}
