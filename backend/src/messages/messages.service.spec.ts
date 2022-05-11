import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { mockMessageEntity } from './mocks/message.entity.mock';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: {
            findOne: jest.fn(() => new mockMessageEntity()),
            find: jest.fn(() => [
              new mockMessageEntity(),
              new mockMessageEntity(),
            ]),
            save: jest.fn(() => new mockMessageEntity()),
            delete: jest.fn(() => void {}),
          },
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            findOne: jest.fn(() => undefined),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create message in channel that does not exist', () => {
    expect(
      service.create({ channelId: 1, senderId: 1, content: 'Hi' }),
    ).rejects.toThrow(EntityDoesNotExistError);
  });
});
