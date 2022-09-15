import { Achievement } from 'src/achievements/entities/achievements.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['achievement', 'userId'])
export class AchievementsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @RelationId((achievementsLog: AchievementsLog) => achievementsLog.user)
  @Column()
  userId: number;

  @ManyToOne(() => Achievement, { onDelete: 'CASCADE' })
  achievement: Achievement;
  @Column()
  @RelationId((achievementsLog: AchievementsLog) => achievementsLog.achievement)
  achievementId: number;
}
