import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryBlockDto {
  @ApiPropertyOptional({
    description: 'Source User Id',
  })
  @IsOptional()
  @IsNumberString()
  sourceId?: string;

  @ApiPropertyOptional({
    description: 'Target User Id',
  })
  @IsOptional()
  @IsNumberString()
  targetId?: string;
}
