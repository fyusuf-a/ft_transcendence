import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsEnum } from 'class-validator';
import { MatchStatusType } from '../entities/match.entity';

export class QueryMatchDto {
  /*@ApiPropertyOptional({
    description: 'The id of a match',
  })
  @IsPositive()
  @IsInt()
  id: number;
*/
  @ApiPropertyOptional({
    description: `The id of the 'home' user`,
  })
  @IsOptional()
  @IsNumberString()
  homeId?: string;

  @ApiPropertyOptional({
    description: `The id of the 'away' user`,
  })
  @IsOptional()
  @IsNumberString()
  awayId?: string;

  @ApiPropertyOptional({
    description: 'The outcome of the match',
  })
  @IsOptional()
  @IsEnum(MatchStatusType)
  role?: MatchStatusType;
}
