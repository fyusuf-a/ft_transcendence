import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { User } from '../users/entities/user.entity';
import { Friendship } from '../relationships/entities/friendship.entity';
import { Block } from '../relationships/entities/block.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from '../matches/entities/match.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friendship,
      Block,
      Channel,
      Message,
      Achievement,
      AchievementsLog,
      Membership,
      Match,
    ]),
  ],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
