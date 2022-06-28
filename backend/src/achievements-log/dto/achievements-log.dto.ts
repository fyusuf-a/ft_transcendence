import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AchievementsLogDto {
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    description: 'The id of the associated user',
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'The id of the associated achievement',
  })
  @IsNotEmpty()
  achievementId: number;
}
