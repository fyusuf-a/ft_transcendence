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
  @ManyToOne(() => Channel, { onDelete: 'CASCADE' })
  channel: Channel;
  @RelationId((membership: Membership) => membership.channel)
  @Column()
  channelId: number;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @RelationId((membership: Membership) => membership.user)
  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: MembershipRoleType,
    default: MembershipRoleType.PARTICIPANT,
  })
  role: MembershipRoleType;

  @Column({ type: 'timestamptz', nullable: true })
  mutedUntil: Date;

  @Column({ type: 'timestamptz', nullable: true })
  bannedUntil: Date;
}
