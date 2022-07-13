import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelsRepository from './repository/channel.repository';
import UserRepository from 'src/users/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelsRepository, UserRepository])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
