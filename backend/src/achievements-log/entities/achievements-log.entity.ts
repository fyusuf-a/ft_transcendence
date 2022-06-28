import { Achievement } from 'src/achievements/entities/achievements.entity';
import { User } from 'src/users/entities/user.entity';
import {
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
  userId: number;

  @Exclude()
  @ManyToOne(() => Achievement)
  achievement: Achievement;
  @RelationId((achievementsLog: AchievementsLog) => achievementsLog.achievement)
  achievementId: number;
}
