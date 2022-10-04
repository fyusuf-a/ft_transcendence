import { Test, TestingModule } from '@nestjs/testing';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, EntityNotFoundError } from 'typeorm';
import { MessagesService } from './messages.service';
import { MockMessageEntity } from './mocks/message.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageDto } from '@dtos/pages';
import { Message } from './entities/message.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { UsersService } from 'src/users/users.service';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from 'src/matches/entities/match.entity';

const messageNumber = 2;
const userNumber = 2;
const channelNumber = 2;
const membershipNumber = 2;

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        UsersService,
        {
          provide: getRepositoryToken(Message),
          useValue: new MockRepository<MockMessageEntity>(
            () => new MockMessageEntity(),
            messageNumber,
          ),
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: new MockRepository(() => new Channel(), channelNumber),
        },
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(() => new User(), userNumber),
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: new MockRepository(
            () => new Membership(),
            membershipNumber,
          ),
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: new MockRepository(() => new Friendship(), userNumber),
        },
        {
          provide: getRepositoryToken(Block),
          useValue: new MockRepository(() => new Block(), userNumber),
        },
        {
          provide: getRepositoryToken(AchievementsLog),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Match),
          useValue: jest.fn(),
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
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new EntityNotFoundError('', ''));
      expect(
        service.create({
          channelId: channelNumber + 1,
          senderId: 1,
          content: 'Hi',
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('when creating a message with sender that does not exist', () => {
    it('should throw', () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new EntityNotFoundError('', ''));
      expect(
        service.create({
          channelId: 1,
          senderId: userNumber + 1,
          content: 'Hi',
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('when creating a message with existing channel and sender', () => {
    it('should create', async () => {
      const result = await service.create({
        channelId: 1,
        senderId: 2,
        content: 'Hi',
      });
      expect(result.channelId).toBe(1);
      expect(result.channel.id).toBe(1);
      expect(result.senderId).toBe(2);
      expect(result.sender.id).toBe(2);
      expect(result.content).toBe('Hi');
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
