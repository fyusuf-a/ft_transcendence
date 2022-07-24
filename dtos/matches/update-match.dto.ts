import { PartialType, PickType } from '@nestjs/swagger';
import { MatchDto } from './match.dto';

export class UpdateMatchDto extends PickType(PartialType(MatchDto), [
  'end',
  'status',
]) {}
