import { OmitType } from '@nestjs/swagger';
import { BlockDto } from './block.dto';

export class UpdateBlockDto extends OmitType(BlockDto, [
  'sourceId',
  'targetId',
]) {}
