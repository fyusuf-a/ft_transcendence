import { PartialType, PickType } from '@nestjs/swagger';
import { CreateRelationshipDto } from './create-relationship.dto';

export class UpdateRelationshipDto extends PickType(
  PartialType(CreateRelationshipDto),
  ['type'],
) {}
