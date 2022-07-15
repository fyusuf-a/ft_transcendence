import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import MessageRepository from 'src/messages/repository/message.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import UserRepository from 'src/users/repository/user.repository';
import { AchievementsLogRepository } from 'src/achievements-log/repository/achievements-log.repository';
import { AchievementRepository } from 'src/achievements/repository/achievements.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      ChannelRepository,
      UserRepository,
      AchievementRepository,
      AchievementsLogRepository,
    ]),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
