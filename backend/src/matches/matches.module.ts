import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import MatchRepository from './repository/match.repository';
import UserRepository from 'src/users/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatchRepository, UserRepository])],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService],
})
export class MatchesModule {}
