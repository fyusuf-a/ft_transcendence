import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AchievementDto {
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsNotEmpty()
  @ApiProperty()
  description!: string;

  @ApiProperty()
  icon!: Uint8Array;

  @ApiProperty()
  id!: number;
}
