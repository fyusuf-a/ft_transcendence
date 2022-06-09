import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import MessageRepository from './repository/message.repository';
import UserRepository from '../users/repository/user.repository';
import ChannelRepository from '../channels/repository/channel.repository';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        MessagesService,
        {
          provide: MessageRepository,
          useValue: jest.fn(),
        },
        {
          provide: UserRepository,
          useValue: jest.fn(),
        },
        {
          provide: ChannelRepository,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
