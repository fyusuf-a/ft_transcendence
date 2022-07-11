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
import { JwtAuthGuard } from './auth/auth.jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AchievementsModule } from './achievements/achievements.module';
import { Achievement } from './achievements/entities/achievements.entity';
import { MatchesModule } from './matches/matches.module';
import { Match } from './matches/entities/match.entity';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    MatchesModule,
    CaslModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
