import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MatchesModule } from 'src/matches/matches.module';
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
    NotificationsModule,
    AchievementsLogModule,
  ],
  providers: [GameGateway],
  exports: [GameGateway],
})
export class GameModule {}
