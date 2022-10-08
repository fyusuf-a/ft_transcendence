import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsGateway } from './notifications.gateway';
import { Membership } from 'src/casl/casl-ability.factory';
import { Channel } from 'src/channels/entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Match, Channel, Membership]),
    UsersModule,
  ],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
