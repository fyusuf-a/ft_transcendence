import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from 'src/matches/entities/match.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Membership } from 'src/memberships/entities/membership.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Channel,
      User,
      Friendship,
      Block,
      AchievementsLog,
      Match,
      Membership,
    ]),
  ],
  providers: [
    ConfigService,
    MessagesService,
    UsersService,
    NotificationsGateway,
  ],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
