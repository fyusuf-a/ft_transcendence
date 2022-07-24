import { MatchDto } from './match.dto';
import { PickType } from '@nestjs/swagger';

export class QueryMatchDto extends PickType(MatchDto, [
  'homeId',
  'awayId',
  'status',
]) {}
