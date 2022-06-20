import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ResponseMessageDto } from './dto/response-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { BadRequestException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import MessageRepository from './repository/message.repository';
import UserRepository from '../users/repository/user.repository';
import ChannelRepository from '../channels/repository/channel.repository';
import { Message } from './entities/message.entity';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto, takeDefault } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

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
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
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
        throw new EntityDoesNotExistError('error');
      });
      expect(controller.create(createMessageDto)).rejects.toThrow(
        BadRequestException,
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
      const expected = new ResponseMessageDto(mockOut[0]);
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if message not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
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
