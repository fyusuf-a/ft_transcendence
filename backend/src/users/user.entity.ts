import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  identity: string;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'bytea' })
  avatar: Uint8Array;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @Column()
  rating: number;

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
  blocked: User;
  @RelationId((user: User) => user.blocked)
  blockedIds: number[];
}
