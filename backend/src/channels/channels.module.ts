import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from './entities/channel.entity';
import { ConfigModule } from '@nestjs/config';
import { MembershipsModule } from 'src/memberships/memberships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]),
    MembershipsModule,
    ConfigModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
