import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import { AchievementsLogRepository } from 'src/achievements-log/repository/achievements-log.repository';
import { AchievementRepository } from 'src/achievements/repository/achievements.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementRepository,
      AchievementsLogRepository,
      Membership,
      UserRepository,
      ChannelRepository,
    ]),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
