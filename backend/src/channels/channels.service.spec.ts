import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { MockChannelEntity } from './mocks/channel.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import ChannelRepository from './repository/channel.repository';
import { PageDto } from 'src/common/dto/page.dto';

const entityNumber = 2;

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(ChannelRepository),
          useValue: new MockRepository<MockChannelEntity>(
            new MockChannelEntity(),
            entityNumber,
          ),
        },
      ],
    }).compile();
    service = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when looking up an existing Channel by id', () => {
    it('should return Channel', async () => {
      expect(await service.findOne(0)).toEqual(new MockChannelEntity());
    });
  });

  describe('when looking up an non-existing Channel by id', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ChannelsService,
          {
            provide: getRepositoryToken(ChannelRepository),
            useValue: {
              findOne: jest.fn(() => undefined),
            },
          },
        ],
      }).compile();
      service = module.get<ChannelsService>(ChannelsService);
    });
    it('should return undefined', async () => {
      expect(await service.findOne(1)).toEqual(undefined);
    });
  });

  describe('when finding all Channels', () => {
    it('should return array of Channel', async () => {
      const ret = await service.findAll();
      expect(ret).toBeInstanceOf(PageDto);
    });
  });

  describe('when creating a new Channel', () => {
    it('should return new channel object', async () => {
      const channelDto: CreateChannelDto = new CreateChannelDto();
      expect(await service.create(channelDto)).toEqual(new MockChannelEntity());
    });
  });

  describe('when removing a new Channel', () => {
    it('should return void', async () => {
      expect(await service.remove(0)).toBeInstanceOf(DeleteResult);
    });
  });

  describe('update()', () => {
    it('should return an update result', async () => {
      expect(await service.update(0, new UpdateChannelDto())).toEqual(
        new UpdateResult(),
      );
    });
  });
});
