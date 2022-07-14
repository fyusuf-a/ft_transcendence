import { Message } from '../../messages/entities/message.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { Membership } from '../../memberships/entities/membership.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export enum ChannelType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
  DIRECT = 'direct',
}

@Unique(['userOne', 'userTwo'])
@Check(`"userOneId" != "userTwoId"`)
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
  @IsOptional()
  @ManyToOne(() => User)
  userOne?: User;
  @RelationId((channel: Channel) => channel.userOne)
  @IsOptional()
  userOneId?: number;

  @Exclude()
  @IsOptional()
  @ManyToOne(() => User)
  userTwo?: User;
  @RelationId((channel: Channel) => channel.userTwo)
  @IsOptional()
  userTwoId?: number;

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
}
