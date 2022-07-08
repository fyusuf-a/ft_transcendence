import { Module } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '../entities/friendship.entity';
import UserRepository from 'src/users/repository/user.repository';
import { FriendshipRepository } from './repositories/friendship.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Friendship,
      UserRepository,
      FriendshipRepository,
    ]),
  ],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
  exports: [FriendshipsService],
})
export class FriendshipsModule {}
