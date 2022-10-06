import { MembershipRoleType } from '@dtos/memberships';

export class MembershipDto {
  id: number;
  channelId: number;
  userId: number;
  mutedUntil?: Date;
  bannedUntil?: Date;
  role: MembershipRoleType;

  constructor(
    id: number,
    channelId: number,
    userId: number,
    role: MembershipRoleType,
    mutedUntil?: Date,
    bannedUntil?: Date,
  ) {
    this.id = id;
    this.channelId = channelId;
    this.role = role;
    this.userId = userId;
    this.mutedUntil = mutedUntil;
    this.bannedUntil = bannedUntil;
  }
}
