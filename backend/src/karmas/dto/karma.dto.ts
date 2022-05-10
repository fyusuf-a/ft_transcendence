import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
import { KarmaType } from '../entities/karma.entity';

export class KarmaDto {
  @ApiProperty({
    description: 'The id of the karma',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The associated channel',
  })
  channel: Channel;
  @ApiProperty({
    description: "The associated channel's id",
  })
  channelId: number;

  @ApiProperty({
    description: 'The affected user',
  })
  user: User;
  @ApiProperty({
    description: "The associated user's id",
  })
  userId: number;

  @ApiProperty({
    description: 'Start time of the karma',
  })
  start: Date;

  @ApiProperty({
    description: 'End time of the karma',
  })
  end: Date;

  @ApiProperty({
    description: 'The karma type',
  })
  type: KarmaType;
}
