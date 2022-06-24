import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { BlockTypeEnum } from '../entities/block.entity';

export class BlockDto {
  @ApiProperty({
    description: 'The id of a Block entry',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'The id of the first user',
  })
  @IsInt()
  @IsPositive()
  sourceId: number;

  @ApiProperty({
    description: 'The id of the second user',
  })
  @IsInt()
  @IsPositive()
  targetId: number;

  @ApiProperty({
    description: 'The status of the Block',
    type: BlockTypeEnum,
    enum: BlockTypeEnum,
    enumName: 'BlockTypeEnum',
    isArray: false,
    examples: [BlockTypeEnum.S_BLOCKS_T, BlockTypeEnum.MUTUAL],
  })
  @IsEnum(BlockTypeEnum, { each: true })
  status: BlockTypeEnum;
}
