import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementsLog } from './achievements-log/entities/achievements-log.entity';
import { ChannelsService } from './channels/channels.service';
import { Channel } from './channels/entities/channel.entity';
import { ChatGateway } from './chat.gateway';
import { Membership } from './memberships/entities/membership.entity';
import { MembershipsService } from './memberships/memberships.service';
import { Message } from './messages/entities/message.entity';
import { MessagesService } from './messages/messages.service';
import { Block } from './relationships/entities/block.entity';
import { Friendship } from './relationships/entities/friendship.entity';
import { User } from './users/entities/user.entity';

import { UsersService } from './users/users.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        ChatGateway,
        MessagesService,
        UsersService,
        MembershipsService,
        ChannelsService,
        {
          provide: getRepositoryToken(Message),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Channel),
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
          provide: getRepositoryToken(Membership),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AchievementsLog),
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
