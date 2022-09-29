import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AchievementsLog } from '../achievements-log/entities/achievements-log.entity';
import { Block } from '../relationships/entities/block.entity';
import { Friendship } from '../relationships/entities/friendship.entity';
import { GameGateway } from './game.gateway';
import { Match } from '../matches/entities/match.entity';
import { MatchesService } from '../matches/matches.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from 'src/notifications.gateway';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        GameGateway,
        MatchesService,
        UsersService,
        NotificationsGateway,
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
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
