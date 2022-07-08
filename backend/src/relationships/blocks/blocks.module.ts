import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from '../entities/block.entity';
import UserRepository from 'src/users/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Block, UserRepository])],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
