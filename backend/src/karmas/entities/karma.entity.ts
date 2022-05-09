import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

export enum KarmaType {
  MUTE,
  BAN,
}

@Entity()
export class Karma {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.karmas)
  channel: Channel;
  @RelationId((karma: Karma) => karma.channel)
  channelId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;

  @Column({
    type: 'enum',
    enum: KarmaType,
    default: KarmaType.MUTE,
  })
  type: KarmaType;
}
