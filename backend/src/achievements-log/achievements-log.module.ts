import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsLogController } from './achievements-log.controller';
import { AchievementsLogService } from './achievements-log.service';
import { AchievementsLogRepository } from './repository/achievements-log.repository';
import { AchievementRepository } from 'src/achievements/repository/achievements.repository';
import UserRepository from 'src/users/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementsLogRepository,
      AchievementRepository,
      UserRepository,
    ]),
  ],
  controllers: [AchievementsLogController],
  providers: [AchievementsLogService],
  exports: [AchievementsLogService],
})
export class AchievementsLogModule {}
