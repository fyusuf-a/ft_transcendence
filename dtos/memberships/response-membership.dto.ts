import { OmitType } from '@nestjs/mapped-types';
import { MembershipDto } from './membership.dto';

export class ResponseMembershipDto extends OmitType(MembershipDto, []) {}
