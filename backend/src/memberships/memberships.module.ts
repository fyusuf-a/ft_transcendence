import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, UserRepository, ChannelRepository]),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
