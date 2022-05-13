import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelsService } from './channels/channels.service';
import ChannelRepository from './channels/repository/channel.repository';
import { ChatGateway } from './chat.gateway';
import { MessagesService } from './messages/messages.service';
import MessageRepository from './messages/repository/message.repository';
import UserRepository from './users/repository/user.repository';
import { UsersService } from './users/users.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        MessagesService,
        UsersService,
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
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
