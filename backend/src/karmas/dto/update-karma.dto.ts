import { PartialType } from '@nestjs/swagger';
import { CreateKarmaDto } from './create-karma.dto';

export class UpdateKarmaDto extends PartialType(CreateKarmaDto) {}
