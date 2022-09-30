import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
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

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        MessagesService,
        UsersService,
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
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
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
      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('create()', () => {
    it('should return a ResponseMessageDto', async () => {
      const mockMessage = new Message();
      mockMessage.channelId = 1;
      mockMessage.senderId = 1;
      mockMessage.content = 'message';
      const createMessageDto = new CreateMessageDto();
      createMessageDto.channelId = 1;
      createMessageDto.senderId = 1;
      createMessageDto.content = 'message';
      jest.spyOn(service, 'create').mockImplementation(async () => mockMessage);
      const result = await controller.create(createMessageDto);
      expect(result).toEqual(mockMessage);
    });

    it('should throw BadRequestException if EntityDoesNotExist', async () => {
      const createMessageDto = new CreateMessageDto();
      createMessageDto.channelId = 1;
      createMessageDto.senderId = 1;
      createMessageDto.content = 'message';
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new EntityNotFoundError(Message, 'not found');
      });
      expect(controller.create(createMessageDto)).rejects.toThrow(
        EntityNotFoundError,
      );
    });

    it('should rethrow other errors', async () => {
      const createMessageDto = new CreateMessageDto();
      createMessageDto.channelId = 1;
      createMessageDto.senderId = 1;
      createMessageDto.content = 'message';
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new Error('error');
      });
      expect(controller.create(createMessageDto)).rejects.toThrow(Error);
    });
  });

  describe('findOne()', () => {
    it('should return a message', async () => {
      const mockOut = new Message();
      const expected = new ResponseMessageDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if message not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        throw new EntityNotFoundError(Message, '5');
      });
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.removeById('1');
      expect(result).toBe(expected);
    });
  });
});
