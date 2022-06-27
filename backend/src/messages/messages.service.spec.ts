import { Test, TestingModule } from '@nestjs/testing';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult } from 'typeorm';
import { MessagesService } from './messages.service';
import { MockMessageEntity } from './mocks/message.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import MessageRepository from './repository/message.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import UserRepository from 'src/users/repository/user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockChannelEntity } from 'src/channels/mocks/channel.entity.mock';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { PageDto } from 'src/common/dto/page.dto';

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

  describe('when creating a message in a channel that does not exist', () => {
    it('should throw', () => {
      expect(
        service.create({ channelId: 1, senderId: 1, content: 'Hi' }),
      ).rejects.toThrow(EntityDoesNotExistError);
    });
  });

  describe('when creating a message with sender that does not exist', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MessagesService,
          {
            provide: getRepositoryToken(MessageRepository),
            useValue: {
              findOne: jest.fn(() => new MockMessageEntity()),
              find: jest.fn(() => [
                new MockMessageEntity(),
                new MockMessageEntity(),
              ]),
              save: jest.fn(() => new MockMessageEntity()),
              delete: jest.fn(() => void {}),
            },
          },
          {
            provide: getRepositoryToken(ChannelRepository),
            useValue: {
              findOne: jest.fn(() => {
                const channel = new Channel();
                channel.id = 1;
                return channel;
              }),
            },
          },
          {
            provide: getRepositoryToken(UserRepository),
            useValue: {
              findOne: jest.fn(() => {
                const user = new User();
                user.id = 7;
                return user;
              }),
            },
          },
        ],
      }).compile();
      service = module.get<MessagesService>(MessagesService);
    });
    it('should throw', () => {
      expect(
        service.create({ channelId: 1, senderId: 1, content: 'Hi' }),
      ).rejects.toThrow(EntityDoesNotExistError);
    });
  });

  describe('when creating a message with existing channel and sender', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MessagesService,
          {
            provide: getRepositoryToken(MessageRepository),
            useValue: {
              findOne: jest.fn(() => new MockMessageEntity()),
              find: jest.fn(() => [
                new MockMessageEntity(),
                new MockMessageEntity(),
              ]),
              save: jest.fn(() => new MockMessageEntity()),
              delete: jest.fn(() => new DeleteResult()),
            },
          },
          {
            provide: getRepositoryToken(ChannelRepository),
            useValue: {
              findOne: jest.fn(() => new MockChannelEntity()),
            },
          },
          {
            provide: getRepositoryToken(UserRepository),
            useValue: {
              findOne: jest.fn(() => new MockUserEntity()),
            },
          },
        ],
      }).compile();
      service = module.get<MessagesService>(MessagesService);
    });
    it('should create', async () => {
      expect(
        await service.create({ channelId: 1, senderId: 0, content: 'Hi' }),
      ).toEqual(new MockMessageEntity());
    });
  });

  describe('findAll()', () => {
    it('should return an array of messages', async () => {
      const messages = await service.findAll();
      expect(messages).toBeInstanceOf(PageDto);
      if (messages.data.length !== 0)
        expect(messages.data[0]).toBeInstanceOf(MockMessageEntity);
    });
  });

  describe('findOne()', () => {
    it('should return a message', async () => {
      expect(await service.findOne(1)).toEqual(new MockMessageEntity());
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      expect(await service.remove(5)).toEqual(new DeleteResult());
    });
  });
});
