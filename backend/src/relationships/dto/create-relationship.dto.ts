import { OmitType } from '@nestjs/swagger';
import { RelationshipDto } from './relationship.dto';

export class CreateRelationshipDto extends OmitType(RelationshipDto, ['id']) {}
