import { BlockDto } from './block.dto';
import { OmitType } from '@nestjs/swagger';

export class ResponseBlockDto extends OmitType(BlockDto, ['status']) {}
