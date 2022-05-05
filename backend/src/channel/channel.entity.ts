import { Karma } from 'src/karma/karma.entity';
import { Message } from 'src/messages/message.entity';
import { User } from 'src/users/user.entity';
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

  @Column()
  password: string;

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
