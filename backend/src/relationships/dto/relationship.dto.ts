import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { RelationshipTypeEnum } from '../entities/relationship.entity';

export class RelationshipDto {
  @ApiProperty({
    description: 'The id of a Relationship entry',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'The id of the source user',
  })
  @IsInt()
  @IsPositive()
  sourceId: number;

  @ApiProperty({
    description: 'The id of the target user',
  })
  @IsInt()
  @IsPositive()
  targetId: number;

  @ApiProperty({
    description: 'The type of relationship',
    type: RelationshipTypeEnum,
    enum: RelationshipTypeEnum,
    enumName: 'RelationshipTypeEnum',
    isArray: false,
    examples: [RelationshipTypeEnum.FRIEND, RelationshipTypeEnum.BLOCK],
  })
  @IsEnum(RelationshipTypeEnum, { each: true })
  type: RelationshipTypeEnum;
}
