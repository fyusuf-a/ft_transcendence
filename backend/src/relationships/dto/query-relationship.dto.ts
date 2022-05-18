import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { RelationshipTypeEnum } from '../entities/relationship.entity';

export class QueryRelationshipDto {
  @ApiPropertyOptional({
    description: 'Source User Id',
  })
  @IsOptional()
  @IsNumberString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Target User Id',
  })
  @IsOptional()
  @IsNumberString()
  target?: string;

  @ApiPropertyOptional({
    description: 'Role Type',
  })
  @IsOptional()
  @IsEnum(RelationshipTypeEnum)
  type?: RelationshipTypeEnum;
}
