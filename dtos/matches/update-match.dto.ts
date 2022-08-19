import { PartialType, PickType } from '@nestjs/mapped-types';
import { MatchDto } from './match.dto';

export class UpdateMatchDto extends PickType(PartialType(MatchDto), [
  'end',
  'status',
]) {}
