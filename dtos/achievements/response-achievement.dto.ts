import { OmitType } from '@nestjs/swagger';
import { AchievementDto } from './achievement.dto';

export class ResponseAchievementDto extends OmitType(AchievementDto, []) {}
