import { PartialType, PickType } from '@nestjs/swagger';
import { CreateKarmaDto } from './create-karma.dto';

export class UpdateKarmaDto extends PickType(PartialType(CreateKarmaDto), [
  'start',
  'end',
  'type',
]) {}
