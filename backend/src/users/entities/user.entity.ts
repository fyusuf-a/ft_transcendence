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

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({
    nullable: true,
    default: null,
  })
  avatar: string;

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
}
