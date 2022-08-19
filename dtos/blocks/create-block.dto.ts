import { OmitType } from '@nestjs/mapped-types';
import { BlockDto } from './block.dto';

export class CreateBlockDto extends OmitType(BlockDto, ['id', 'status']) {}
