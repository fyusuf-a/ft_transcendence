import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/achievements/entities/achievements.entity';
import { User } from 'src/users/entities/user.entity';
import { AchievementsLogController } from './achievements-log.controller';
import { AchievementsLogService } from './achievements-log.service';
import { AchievementsLog } from './entities/achievements-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementsLog, Achievement, User])],
  controllers: [AchievementsLogController],
  providers: [AchievementsLogService],
  exports: [AchievementsLogService],
})
export class AchievementsLogModule {}
