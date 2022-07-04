import { PickType } from '@nestjs/swagger';
import { Match } from './match.dto';

export class CreateMatchDto extends PickType(Match, ['homeId', 'awayId']) {}
