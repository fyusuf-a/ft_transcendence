import { Achievement } from 'src/achievements/entities/achievements.entity';
import { User } from 'src/users/entities/user.entity';
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
export class AchievementsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @ManyToOne(() => User)
  user: User;
  @RelationId((achievementsLog: AchievementsLog) => achievementsLog.user)
  @Column()
  userId: number;

  @ManyToOne(() => Achievement)
  achievement: Achievement;
  @Column()
  @RelationId((achievementsLog: AchievementsLog) => achievementsLog.achievement)
  achievementId: number;
}
