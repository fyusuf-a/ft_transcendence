import { Channel } from '../channels/entities/channel.entity';
import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  sender: User;
  @RelationId((message: Message) => message.sender)
  senderId: number;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;
  @RelationId((message: Message) => message.channel)
  channelId: number;
}
