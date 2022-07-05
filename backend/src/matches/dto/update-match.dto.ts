import { PartialType, PickType } from '@nestjs/swagger';
import { Match } from './match.dto';

export class UpdateMatchDto extends PickType(PartialType(Match), [
  'end',
  'status',
]) {}
