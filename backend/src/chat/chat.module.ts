import { Module } from '@nestjs/common';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [MembershipsModule, UsersModule, MessagesModule, ChannelsModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
