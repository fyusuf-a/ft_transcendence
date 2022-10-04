import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MatchesModule } from 'src/matches/matches.module';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { UsersModule } from 'src/users/users.module';
import { GameGateway } from './game.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AchievementsLogModule } from 'src/achievements-log/achievements-log.module';
import { Match } from 'src/matches/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    MatchesModule,
    UsersModule,
    GameModule,
    NotificationsModule,
    AchievementsLogModule,
  ],
  providers: [GameGateway, NotificationsGateway],
})
export class GameModule {}
