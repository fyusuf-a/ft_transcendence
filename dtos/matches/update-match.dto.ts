import { PartialType, PickType } from '@nestjs/mapped-types';
import { Match } from './match.dto';

export class UpdateMatchDto extends PickType(PartialType(Match), [
  'end',
  'status',
]) {}
