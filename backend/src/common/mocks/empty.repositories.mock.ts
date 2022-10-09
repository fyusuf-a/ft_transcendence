import { getRepositoryToken } from '@nestjs/typeorm';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Match } from 'src/matches/entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import { Achievement } from 'src/achievements/entities/achievements.entity';

export const emptyRepositories = [
  {
    provide: getRepositoryToken(Match),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(User),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(Friendship),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(Block),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(AchievementsLog),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(Channel),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(Membership),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(Message),
    useValue: jest.fn(),
  },
  {
    provide: getRepositoryToken(Achievement),
    useValue: jest.fn(),
  },
];
