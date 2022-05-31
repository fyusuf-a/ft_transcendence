import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import MessageRepository from 'src/messages/repository/message.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import UserRepository from 'src/users/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      ChannelRepository,
      UserRepository,
    ]),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
