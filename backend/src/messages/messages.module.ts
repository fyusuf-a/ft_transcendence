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
    ]),
  ],
  providers: [MessagesService, UsersService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
