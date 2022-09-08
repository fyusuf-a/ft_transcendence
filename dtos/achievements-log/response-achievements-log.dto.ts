import { OmitType } from '@nestjs/mapped-types';
import { AchievementsLogDto } from './achievements-log.dto';

export class ResponseAchievementsLogDto extends OmitType(AchievementsLogDto, [
  'id',
]) {}
