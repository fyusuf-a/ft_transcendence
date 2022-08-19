import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateMembershipDto } from './create-membership.dto';

export class UpdateMembershipDto extends PickType(
  PartialType(CreateMembershipDto),
  ['role', 'mutedUntil', 'bannedUntil'],
) {}
