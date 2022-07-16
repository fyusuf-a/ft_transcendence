import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsPositive, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum MatchStatusType {
  HOME = 'HOME',
  AWAY = 'AWAY',
  DRAW = 'DRAW',
  ABORTED = 'ABORTED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export class Match {
  @ApiProperty({
    description: 'The id of a match',
  })
  @IsPositive()
  @IsInt()
  id!: number;

  @ApiProperty({
    description: 'The start time of a match',
  })
  @IsDate()
  @Type(() => Date)
  start!: Date;

  @ApiProperty({
    description: 'The end time of a match',
  })
  @IsDate()
  @Type(() => Date)
  end!: Date;

  @ApiProperty({
    description: "The id of the 'home' user",
  })
  @IsPositive()
  @IsInt()
  homeId!: number;

  @ApiProperty({
    description: "The id of the 'away' user",
  })
  @IsInt()
  @IsPositive()
  awayId!: number;

  @ApiProperty({
    description: 'The role of the associated user in the associated channel',
    type: MatchStatusType,
    enum: MatchStatusType,
    enumName: 'MatchStatusType',
    examples: [
      MatchStatusType.HOME,
      MatchStatusType.AWAY,
      MatchStatusType.DRAW,
      MatchStatusType.ABORTED,
      MatchStatusType.IN_PROGRESS,
    ],
  })
  @IsEnum(MatchStatusType)
  status!: MatchStatusType;
}
