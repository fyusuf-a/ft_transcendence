import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from './entities/channel.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Membership } from 'src/memberships/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User, Membership])],
  controllers: [ChannelsController],
  providers: [ChannelsService, MembershipsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
