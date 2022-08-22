import { PickType } from '@nestjs/mapped-types';
import { MatchDto } from './match.dto';

export class CreateMatchDto extends PickType(MatchDto, ['homeId', 'awayId']) {}
