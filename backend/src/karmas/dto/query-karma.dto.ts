import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { KarmaType } from '../entities/karma.entity';

export class QueryKarmaDto {
  @ApiPropertyOptional({
    description: 'Channel Id',
  })
  @IsOptional()
  @IsNumberString()
  channel?: string;

  @ApiPropertyOptional({
    description: 'User Id',
  })
  @IsOptional()
  @IsNumberString()
  user?: string;

  @ApiPropertyOptional({
    description: 'Channel Id',
  })
  @IsOptional()
  @IsEnum(KarmaType)
  type?: KarmaType;
}
