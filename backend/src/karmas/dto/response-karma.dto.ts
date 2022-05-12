import { OmitType } from '@nestjs/swagger';
import { KarmaDto } from './karma.dto';

export class ResponseKarmaDto extends OmitType(KarmaDto, []) {}
