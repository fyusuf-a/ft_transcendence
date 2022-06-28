import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsLogController } from './achievements-log.controller';
import { AchievementsLogService } from './achievements-log.service';
import { AchievementsLogRepository } from './repository/achievements-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementsLogRepository])],
  controllers: [AchievementsLogController],
  providers: [AchievementsLogService],
  exports: [AchievementsLogService],
})
export class AchievementsLogModule {}
