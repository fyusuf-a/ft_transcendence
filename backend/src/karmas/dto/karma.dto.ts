import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsPositive } from 'class-validator';
import { KarmaType } from '../entities/karma.entity';

export class KarmaDto {
  @ApiProperty({
    description: 'The id of the karma',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description: "The associated channel's id",
  })
  @IsInt()
  @IsPositive()
  channelId: number;

  @ApiProperty({
    description: "The associated user's id",
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Start time of the karma',
  })
  @IsDateString()
  start: Date;

  @ApiProperty({
    description: 'End time of the karma',
  })
  @IsDateString()
  end: Date;

  @ApiProperty({
    description: 'The karma type',
    type: KarmaType,
    enum: KarmaType,
    enumName: 'KarmaType',
    isArray: false,
    examples: [KarmaType.MUTE, KarmaType.BAN],
  })
  @IsEnum(KarmaType, { each: true })
  type: KarmaType;
}
