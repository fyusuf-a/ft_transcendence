import { OmitType } from '@nestjs/mapped-types';
import { AchievementDto } from './achievement.dto';

export class ResponseAchievementDto extends OmitType(AchievementDto, ['id']) {}
