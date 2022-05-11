import { Karma } from '../../karmas/entities/karma.entity';
import { Message } from '../../messages/entities/message.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { Membership } from '../../memberships/entities/membership.entity';
import { Exclude } from 'class-transformer';

export enum ChannelType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ChannelType,
    default: ChannelType.PRIVATE,
  })
  type: ChannelType;

  @IsOptional()
  @Column({ nullable: true })
  password?: string;

  @Exclude()
  @OneToMany(() => Membership, (membership) => membership.channel)
  memberships: Membership[];
  @Exclude()
  @RelationId((channel: Channel) => channel.memberships)
  membershipIds: number[];

  @Exclude()
  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
  @Exclude()
  @RelationId((channel: Channel) => channel.messages)
  messageIds: number[];

  @OneToMany(() => Karma, (karma) => karma.channel)
  karmas: Karma[];
}
