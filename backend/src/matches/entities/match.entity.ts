import {
  RelationId,
  ManyToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Exclude } from 'class-transformer';

export enum MatchStatusType {
  HOME = 'HOME',
  AWAY = 'AWAY',
  DRAW = 'DRAW',
  ABORTED = 'ABORTED',
  IN_PROGRESS = 'IN_PROGRESS',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  start: Date;

  // end is null if the match is not finished
  @Column({ type: 'timestamptz', nullable: true })
  end: Date;

  @Exclude()
  @ManyToOne(() => User)
  home: User;
  @RelationId((match: Match) => match.home)
  homeId: number;

  @Exclude()
  @ManyToOne(() => User)
  away: User;
  @RelationId((match: Match) => match.away)
  awayId: number;

  @Column({
    type: 'enum',
    enum: MatchStatusType,
    default: MatchStatusType.IN_PROGRESS,
  })
  status: MatchStatusType;
}
