import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseAchievementDto } from '@dtos/achievements';

export class AchievementsLogDto {
  @IsNotEmpty()
  @ApiProperty()
  id!: number;

  @IsNotEmpty()
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({
    description: 'The id of the associated user',
  })
  @IsNotEmpty()
  userId!: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the associated achievement',
  })
  achievementId!: number;

  @ApiProperty({
    description: 'The achievement itself.',
  })
  @IsNotEmpty()
  achievement!: ResponseAchievementDto;
}
