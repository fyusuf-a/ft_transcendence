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

export enum ChannelType {
  PUBLIC,
  PRIVATE,
  PROTECTED,
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

  @OneToMany(() => Membership, (membership) => membership.channel)
  memberships: Membership[];
  @RelationId((channel: Channel) => channel.memberships)
  membershipIds: number[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
  @RelationId((channel: Channel) => channel.messages)
  messageIds: number[];

  @OneToMany(() => Karma, (karma) => karma.channel)
  karmas: Karma[];
}
