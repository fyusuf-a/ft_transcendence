import { OmitType } from "@nestjs/swagger";
import { MembershipDto } from "./membership.dto";

export class ResponseMembershipDto extends OmitType(MembershipDto, [

]) {}
