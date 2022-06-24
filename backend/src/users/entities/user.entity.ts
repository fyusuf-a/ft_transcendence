import { Exclude } from 'class-transformer';
import { Membership } from '../../memberships/entities/membership.entity';
import {
  Column,
  Entity,
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
  @Column('int', { array: true, default: [] })
  @Exclude()
  @RelationId((user: User) => user.memberships)
  membershipIds: number[];

  @Column('int', { array: true, default: [] })
  friendshipsIds: number[];
  @Column('int', { array: true, default: [] })
  blocksIds: number[];
}
