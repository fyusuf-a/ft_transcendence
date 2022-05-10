import { Karma } from '../../karmas/entities/karma.entity';
import { Message } from '../../messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { IsOptional } from 'class-validator';

export enum ChannelType {
  PRIVATE,
  PUBLIC,
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

  @ManyToOne(() => User)
  owner: User;
  @RelationId((channel: Channel) => channel.owner)
  ownerId: number;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'channel_admins_user',
    joinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  admins: User[];
  @RelationId((channel: Channel) => channel.admins)
  adminIds: number[];

  @ManyToMany(() => User)
  participants: User[];
  @RelationId((channel: Channel) => channel.participants)
  paricipantIds: number[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
  @RelationId((channel: Channel) => channel.messages)
  messageIds: number[];

  @OneToMany(() => Karma, (karma) => karma.channel)
  karmas: Karma[];
}
