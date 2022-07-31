import { PickType } from '@nestjs/mapped-types';
import { AchievementDto } from './achievement.dto';

export class CreateAchievementDto extends PickType(AchievementDto, [
  'name',
  'description',
  'icon',
]) {}
