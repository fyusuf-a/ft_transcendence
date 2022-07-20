import { Test, TestingModule } from '@nestjs/testing';
import { PageDto, PageMetaDto, PageOptionsDto, takeDefault } from '@dtos/pages';
import UserRepository from 'src/users/repository/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import {
  CreateChannelDto,
  ResponseChannelDto,
  UpdateChannelDto,
} from '@dtos/channels';
import { Channel, ChannelType } from './entities/channel.entity';
import ChannelRepository from './repository/channel.repository';

describe('ChannelsController', () => {
  let controller: ChannelsController;
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        ChannelsService,
        {
          provide: ChannelRepository,
          useValue: jest.fn(),
        },
        UserRepository,
      ],
    }).compile();

    controller = module.get<ChannelsController>(ChannelsController);
    service = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of channels', async () => {
      const expected = new PageDto(
        [],
        new PageMetaDto(new PageOptionsDto(), takeDefault),
      );
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      const result = await controller.findAll();
      expect(result).toBe(expected);
    });
  });

  describe('create()', () => {
    it('should return a ResponseChannelDto', async () => {
      const mockChannel = new Channel();
      mockChannel.name = 'A';
      mockChannel.type = ChannelType.PUBLIC;
      const createChannelDto = new CreateChannelDto();
      createChannelDto.name = 'A';
      createChannelDto.type = ChannelType.PUBLIC;
      jest.spyOn(service, 'create').mockImplementation(async () => mockChannel);
      const result = await controller.create(createChannelDto);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('update()', () => {
    it('should return a ResponseChannelDto', async () => {
      const mock = new UpdateResult();
      const channelDto = new UpdateChannelDto();
      channelDto.name = 'user';
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update('1', channelDto);
      expect(result).toEqual(mock);
    });
  });

  describe('findOne()', () => {
    it('should return a channel', async () => {
      const mockOut = new Channel();
      const expected = new ResponseChannelDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if channel not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove('1');
      expect(result).toBe(expected);
    });
  });
});
