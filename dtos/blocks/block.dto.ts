import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

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
