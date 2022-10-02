import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { User } from '../users/entities/user.entity';
import { Friendship } from '../relationships/entities/friendship.entity';
import { Block } from '../relationships/entities/block.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from '../matches/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friendship,
      Block,
      Achievement,
      AchievementsLog,
      Match,
    ]),
  ],
  providers: [CaslAbilityFactory],
  exports: [
    CaslAbilityFactory,
    TypeOrmModule.forFeature([
      User,
      Friendship,
      Block,
      Achievement,
      AchievementsLog,
      Match,
    ]),
  ],
})
export class CaslModule {}
