import { OmitType } from '@nestjs/swagger';
import { MembershipDto } from './membership.dto';

export class CreateMembershipDto extends OmitType(MembershipDto, ['id']) {}
