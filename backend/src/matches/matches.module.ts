import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { User } from 'src/users/entities/user.entity';
import { Match } from './entities/match.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { UsersService } from 'src/users/users.service';
import { FriendshipsService } from 'src/relationships/friendships/friendships.service';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { CaslModule } from 'src/casl/casl.module';
import { AchievementsLogService } from 'src/achievements-log/achievements-log.service';
import { Achievement } from 'src/achievements/entities/achievements.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementsLog,
      Block,
      Channel,
      Friendship,
      Match,
      Membership,
      User,
    ]),
    CaslModule,
  ],
  providers: [
    AchievementsLogService,
    FriendshipsService,
    MatchesService,
    NotificationsGateway,
    UsersService,
  ],
  controllers: [MatchesController],
  exports: [MatchesService, TypeOrmModule.forFeature([Match])],
})
export class MatchesModule {}
