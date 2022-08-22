import { OmitType } from '@nestjs/mapped-types';
import { BlockDto } from './block.dto';

export class UpdateBlockDto extends OmitType(BlockDto, [
  'id',
  'sourceId',
  'targetId',
]) {}
