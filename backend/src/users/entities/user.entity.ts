import { Exclude } from 'class-transformer';
import { Membership } from '../../memberships/entities/membership.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ unique: true })
  identity: string;

  @Column({ unique: true })
  username: string;

  @Column({
    type: 'bytea',
    nullable: true,
    default: null,
  })
  avatar: Uint8Array;

  @Column({
    default: 0,
  })
  wins: number;

  @Column({
    default: 0,
  })
  losses: number;

  @Column({
    default: 0,
  })
  rating: number;

  @Exclude()
  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];
  @Exclude()
  @RelationId((user: User) => user.memberships)
  membershipIds: number[];

  @ManyToMany(() => User, (friend) => friend.friends)
  @JoinTable({
    name: 'user_friends_user',
    joinColumn: {
      name: 'friender',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friendee',
      referencedColumnName: 'id',
    },
  })
  friends: User[];
  @RelationId((user: User) => user.friends)
  friendIds: number[];

  @Exclude()
  @ManyToMany(() => User, (blocked) => blocked.blocked)
  @JoinTable({
    name: 'user_blocks_user',
    joinColumn: {
      name: 'blocker',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'blockee',
      referencedColumnName: 'id',
    },
  })
  blocked: User[];
  @Exclude()
  @RelationId((user: User) => user.blocked)
  blockedIds: number[];
}
