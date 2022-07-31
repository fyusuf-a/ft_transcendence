import { PickType } from '@nestjs/mapped-types';
import { Match } from './match.dto';

export class CreateMatchDto extends PickType(Match, ['homeId', 'awayId']) {}
