import { Test, TestingModule } from '@nestjs/testing';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { MessagesService } from './messages.service';
import { MockMessageEntity } from './mocks/message.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import MessageRepository from './repository/message.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import UserRepository from 'src/users/repository/user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(MessageRepository),
          useValue: new MockRepository<MockMessageEntity>(
            new MockMessageEntity(),
          ),
        },
        {
          provide: getRepositoryToken(ChannelRepository),
          useValue: new MockRepository(new Channel()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository(new User()),
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
