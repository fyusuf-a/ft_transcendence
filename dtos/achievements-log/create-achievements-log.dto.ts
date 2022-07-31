import { PickType } from '@nestjs/mapped-types';
import { AchievementsLogDto } from './achievements-log.dto';

export class CreateAchievementLogDto extends PickType(AchievementsLogDto, [
  'userId',
  'achievementId',
]) {}
