import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelsService } from './channels/channels.service';
import ChannelRepository from './channels/repository/channel.repository';
import { ChatGateway } from './chat.gateway';
import { Membership } from './memberships/entities/membership.entity';
import { MembershipsService } from './memberships/memberships.service';
import { MessagesService } from './messages/messages.service';
import MessageRepository from './messages/repository/message.repository';
import UserRepository from './users/repository/user.repository';
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
          provide: getRepositoryToken(Membership),
          useClass: Repository,
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
