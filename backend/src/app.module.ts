import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { ChannelsModule } from './channels/channels.module';
import { Channel } from './channels/entities/channel.entity';
import { MembershipsModule } from './memberships/memberships.module';
import { Membership } from './memberships/entities/membership.entity';
import { FriendshipsModule } from './relationships/friendships/friendships.module';
import { BlocksModule } from './relationships/blocks/blocks.module';
import { Friendship } from './relationships/entities/friendship.entity';
import { Block } from './relationships/entities/block.entity';
import { AuthModule } from './auth/auth.module';
import { GlobalAuthGuard } from './auth/auth.global.guard';
import { APP_GUARD } from '@nestjs/core';
import { AchievementsModule } from './achievements/achievements.module';
import { Achievement } from './achievements/entities/achievements.entity';
import { AchievementsLogModule } from './achievements-log/achievements-log.module';
import { AchievementsLog } from './achievements-log/entities/achievements-log.entity';
import { MatchesModule } from './matches/matches.module';
import { Match } from './matches/entities/match.entity';
import configuration from './config/configuration';
import { ChatGateway } from './chat.gateway';
import { GameGateway } from '@/game/game.gateway';
import { NotificationsGateway } from './notifications.gateway';
import { Repository } from 'typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Message,
        Channel,
        Membership,
        Friendship,
        Block,
        Achievement,
        AchievementsLog,
        Match,
      ],
      synchronize: true,
    }),
    UsersModule,
    MessagesModule,
    ChannelsModule,
    MembershipsModule,
    FriendshipsModule,
    BlocksModule,
    AuthModule,
    AchievementsModule,
    AchievementsLogModule,
    MatchesModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [
    Repository,
    ChatGateway,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
    GameGateway,
    NotificationsGateway,
  ],
})
export class AppModule {}
