import { PickType } from '@nestjs/swagger';
import { AchievementsLogDto } from './achievements-log.dto';

export class CreateAchievementLogDto extends PickType(AchievementsLogDto, [
  'userId',
  'achievementId',
]) {}
