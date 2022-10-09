import { MockRepository } from 'src/common/mocks/repository.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MembershipsService } from '../memberships/memberships.service';
import { CreateMessageDto, ResponseMessageDto } from '@dtos/messages';
import { DeleteResult, EntityNotFoundError } from 'typeorm';
import { Message } from './entities/message.entity';
import { PageMetaDto, PageDto, PageOptionsDto, takeDefault } from '@dtos/pages';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { UsersService } from 'src/users/users.service';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from 'src/matches/entities/match.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { ConfigService } from '@nestjs/config';
import { QueryMessageDto } from '@dtos/messages/query-message.dto';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;
  let membershipService: MembershipsService;
  const user = { id: 1 } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        MessagesService,
        MembershipsService,
        UsersService,
        NotificationsGateway,
        ConfigService,
        {
          provide: getRepositoryToken(Message),
          useValue: new MockRepository(() => new Message()),
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
          provide: Friendship,
          useValue: jest.fn(),
        },
        {
          provide: Block,
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Membership),
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
        {
          provide: getRepositoryToken(Match),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: jest.fn(),
        },
        {
          provide: EventEmitter2,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
    membershipService = module.get<MembershipsService>(MembershipsService);
    jest.spyOn(membershipService, 'isUserCapableInChannel').mockResolvedValue();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of messages', async () => {
      const expected = new PageDto(
        [],
        new PageMetaDto(new PageOptionsDto(), takeDefault),
      );
      jest
        .spyOn(service, 'findAllWithBlocks')
        .mockImplementation(async () => expected);
      const query: QueryMessageDto = new QueryMessageDto();
      const result = await controller.findAll(user, query);
      expect(result).toEqual(expected);
    });
  });

  describe('create()', () => {
    it.skip('should return a ResponseMessageDto', async () => {
      const mockMessage = new Message();
      mockMessage.channelId = 1;
      mockMessage.senderId = 1;
      mockMessage.content = 'message';
      const createMessageDto = new CreateMessageDto();
      createMessageDto.channelId = 1;
      createMessageDto.senderId = 1;
      createMessageDto.content = 'message';
      jest.spyOn(service, 'create').mockImplementation(async () => mockMessage);
      const result = await controller.create(user, createMessageDto);
      expect(result).toEqual(mockMessage);
    });

    it.skip('should throw BadRequestException if EntityDoesNotExist', async () => {
      const createMessageDto = new CreateMessageDto();
      createMessageDto.channelId = 1;
      createMessageDto.senderId = 1;
      createMessageDto.content = 'message';
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new EntityNotFoundError(Message, 'not found');
      });
      expect(controller.create(user, createMessageDto)).rejects.toThrow(
        EntityNotFoundError,
      );
    });

    it.skip('should rethrow other errors', async () => {
      const createMessageDto = new CreateMessageDto();
      createMessageDto.channelId = 1;
      createMessageDto.senderId = 1;
      createMessageDto.content = 'message';
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new Error('error');
      });
      expect(controller.create(user, createMessageDto)).rejects.toThrow(Error);
    });
  });

  describe('findOne()', () => {
    it.skip('should return a message', async () => {
      const mockOut = new Message();
      const expected = new ResponseMessageDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      jest
        .spyOn(membershipService, 'hasUserRoleInChannel')
        .mockImplementation();
      const result = await controller.findOne(user, '1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if message not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        throw new EntityNotFoundError(Message, '5');
      });
      expect(controller.findOne(user, '5')).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const mockMessage: Message = new Message();
      mockMessage.senderId = 1;
      mockMessage.channelId = 1;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockMessage);
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.removeById(user, '1');
      expect(result).toBe(expected);
    });
  });
});
