import { PickType } from '@nestjs/swagger';
import { AchievementDto } from './achievement.dto';

export class CreateAchievementDto extends PickType(AchievementDto, [
  'name',
  'description',
  'icon',
]) {}
