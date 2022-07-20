import { OmitType } from '@nestjs/swagger';
import { AchievementsLogDto } from './achievements-log.dto';

export class ResponseAchievementsLogDto extends OmitType(AchievementsLogDto, [
  'id',
]) {}
