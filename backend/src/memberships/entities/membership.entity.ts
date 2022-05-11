import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Channel } from '../../channels/entities/channel.entity';
import { Exclude } from 'class-transformer';

export enum MembershipRoleType {
  PARTICIPANT = 'participant',
  ADMIN = 'admin',
  OWNER = 'owner',
}

@Unique(['channel', 'user'])
@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => Channel)
  channel: Channel;
  @RelationId((membership: Membership) => membership.channel)
  channelId: number;

  @Exclude()
  @ManyToOne(() => User)
  user: User;
  @RelationId((membership: Membership) => membership.user)
  userId: number;

  @Column({
    type: 'enum',
    enum: MembershipRoleType,
    default: MembershipRoleType.PARTICIPANT,
  })
  role: MembershipRoleType;
}
