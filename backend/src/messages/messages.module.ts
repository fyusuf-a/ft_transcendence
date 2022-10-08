import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Message } from './entities/message.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Membership } from 'src/memberships/entities/membership.entity';
import { UsersModule } from 'src/users/users.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Channel, User, Membership]),
    UsersModule,
    NotificationsModule,
    MembershipsModule,
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
