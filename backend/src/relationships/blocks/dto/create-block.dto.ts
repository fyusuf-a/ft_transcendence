import { OmitType } from '@nestjs/swagger';
import { BlockDto } from './block.dto';

export class CreateBlockDto extends OmitType(BlockDto, ['id', 'status']) {}
