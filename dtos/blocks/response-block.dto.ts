import { BlockDto } from './block.dto';
import { OmitType } from '@nestjs/mapped-types';

export class ResponseBlockDto extends OmitType(BlockDto, ['status']) {}
