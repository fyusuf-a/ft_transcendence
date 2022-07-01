import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';

export enum FriendshipTypeEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

@Unique(['source', 'target'])
@Entity()
@Check(`"sourceId" != "targetId"`)
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => User)
  source: User;
  @RelationId((friendship: Friendship) => friendship.source)
  sourceId: number;

  @Exclude()
  @ManyToOne(() => User)
  target: User;
  @RelationId((friendship: Friendship) => friendship.target)
  targetId: number;

  @Column({
    type: 'enum',
    enum: FriendshipTypeEnum,
    default: FriendshipTypeEnum.PENDING,
  })
  status: FriendshipTypeEnum;
}
