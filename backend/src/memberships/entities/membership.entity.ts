import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Channel } from '../../channels/entities/channel.entity';

export enum MembershipRoleType {
  PARTICIPANT,
  ADMIN,
  OWNER,
}

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel)
  channel: Channel;
  @RelationId((membership: Membership) => membership.channel)
  channelId: number;

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
