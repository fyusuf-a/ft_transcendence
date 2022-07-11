import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import UserRepository from './repository/user.repository';
import { FriendshipRepository } from 'src/relationships/friendships/repositories/friendship.repository';
import { BlockRepository } from 'src/relationships/blocks/repositories/blocks.repository';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      FriendshipRepository,
      BlockRepository,
    ]),
    CaslModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
