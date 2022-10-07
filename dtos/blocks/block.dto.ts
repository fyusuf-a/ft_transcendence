import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export enum BlockTypeEnum {
  T_BLOCKS_S = 'target_blocks_source',
  S_BLOCKS_T = 'source_blocks_target',
  MUTUAL = 'mutual',
}

export class BlockDto {
  @ApiProperty({
    description: 'The id of a Block entry',
  })
  @IsInt()
  @IsPositive()
  id!: number;

  @ApiProperty({
    description: 'The id of the first user',
  })
  @IsInt()
  @IsPositive()
  sourceId!: number;

  @ApiProperty({
    description: 'The id of the second user',
  })
  @IsInt()
  targetId!: number;
}
