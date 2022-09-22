import {
  RelationId,
  ManyToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { MatchStatusType } from '@dtos/matches';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  start: Date;

  // end is null if the match is not finished
  @Column({ type: 'timestamptz', nullable: true })
  end: Date;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  home: User;
  @Column()
  @RelationId((match: Match) => match.home)
  homeId: number;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  away: User;
  @Column()
  @RelationId((match: Match) => match.away)
  awayId: number;

  @Column({
    type: 'enum',
    enum: MatchStatusType,
    default: MatchStatusType.IN_PROGRESS,
  })
  status: MatchStatusType;
}
