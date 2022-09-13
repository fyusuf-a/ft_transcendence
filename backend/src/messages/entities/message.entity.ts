import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;
  @RelationId((message: Message) => message.sender)
  senderId: number;

  @Exclude()
  @ManyToOne(() => Channel, (channel) => channel.messages, {
    onDelete: 'CASCADE',
  })
  channel: Channel;
  @RelationId((message: Message) => message.channel)
  channelId: number;

  @CreateDateColumn()
  createdAt: Date;
}
