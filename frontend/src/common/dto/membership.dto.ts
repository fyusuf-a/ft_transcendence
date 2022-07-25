export class MembershipDto {
  id: number;
  channelId: number;
  userId: number;
  mutedUntil?: Date;
  bannedUntil?: Date;

  constructor(
    id: number,
    channelId: number,
    userId: number,
    mutedUntil?: Date,
    bannedUntil?: Date,
  ) {
    this.id = id;
    this.channelId = channelId;
    this.userId = userId;
    this.mutedUntil = mutedUntil;
    this.bannedUntil = bannedUntil;
  }
}
