import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementsLogService } from './achievements-log/achievements-log.service';
import { AchievementsLogRepository } from './achievements-log/repository/achievements-log.repository';
import { AchievementRepository } from './achievements/repository/achievements.repository';
import { ChannelsService } from './channels/channels.service';
import ChannelRepository from './channels/repository/channel.repository';
import { ChatGateway } from './chat.gateway';
import { Membership } from './memberships/entities/membership.entity';
import { MembershipsService } from './memberships/memberships.service';
import { MessagesService } from './messages/messages.service';
import MessageRepository from './messages/repository/message.repository';
import { BlockRepository } from './relationships/blocks/repositories/blocks.repository';
import { FriendshipRepository } from './relationships/friendships/repositories/friendship.repository';
import UserRepository from './users/repository/user.repository';
import { UsersService } from './users/users.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AchievementsLogService,
        ChatGateway,
        MessagesService,
        UsersService,
        MembershipsService,
        ChannelsService,
        {
          provide: getRepositoryToken(MessageRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(ChannelRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(FriendshipRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(BlockRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Membership),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AchievementsLogRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(AchievementRepository),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
