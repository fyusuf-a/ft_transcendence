import { Test, TestingModule } from '@nestjs/testing';
import { CaslAbilityFactory } from './casl-ability.factory';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { Block } from '../relationships/entities/block.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Achievement } from 'src/achievements/entities/achievements.entity';
import { Friendship } from '../relationships/entities/friendship.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from '../matches/entities/match.entity';

const userNumber = 2;

describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaslAbilityFactory,
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository<MockUserEntity>(
            () => new MockUserEntity(),
            userNumber,
          ),
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: new MockRepository<Friendship>(() => new Friendship()),
        },
        {
          provide: getRepositoryToken(Block),
          useValue: new MockRepository<Block>(() => new Block()),
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: new MockRepository<Channel>(() => new Channel()),
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: new MockRepository<Membership>(() => new Membership()),
        },
        {
          provide: getRepositoryToken(Message),
          useValue: new MockRepository<Message>(() => new Message()),
        },
        {
          provide: getRepositoryToken(Achievement),
          useValue: new MockRepository<Achievement>(() => new Achievement()),
        },
        {
          provide: getRepositoryToken(AchievementsLog),
          useValue: new MockRepository<AchievementsLog>(
            () => new AchievementsLog(),
          ),
        },
        {
          provide: getRepositoryToken(Match),
          useValue: new MockRepository<Match>(() => new Match()),
        },
      ],
    }).compile();

    factory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });
});
