import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto } from '@dtos/channels';
import { MockChannelEntity } from './mocks/channel.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { Channel, ChannelType } from './entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { PageDto } from '@dtos/pages';

const channelNumber = 2;

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: new MockRepository<MockChannelEntity>(
            () => new MockChannelEntity(),
            channelNumber,
          ),
        },
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(() => new User()),
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
      expect(await service.findOne(1)).toEqual(new MockChannelEntity());
    });
  });

  describe('when looking up an non-existing Channel by id', () => {
    it('should return undefined', async () => {
      expect(await service.findOne(channelNumber + 1)).toEqual(undefined);
    });
  });

  describe('when finding all Channels', () => {
    it('should return array of Channel', async () => {
      const ret = await service.findAll();
      expect(ret.data.length).toBe(channelNumber);
      expect(ret).toBeInstanceOf(PageDto);
      expect(ret.data[0]).toBeInstanceOf(MockChannelEntity);
    });
  });

  describe('when creating a new Channel', () => {
    it('should return new channel object', async () => {
      const channelDto: CreateChannelDto = new CreateChannelDto();
      channelDto.type = ChannelType.PRIVATE;
      channelDto.password = undefined;
      channelDto.name = 'channel-name';
      const expected = new MockChannelEntity();
      expected.id = channelNumber + 1;
      expect(await service.create(channelDto)).toEqual(expected);
    });
  });

  describe('when creating a protected Channel', () => {
    it('password should be hashed', async () => {
      const channelDto: CreateChannelDto = new CreateChannelDto();
      channelDto.type = ChannelType.PROTECTED;
      channelDto.password = 'badpassword';
      channelDto.name = 'protectedChannelName';
      const result = await service.create(channelDto);
      expect(result.password).toContain('$2b$10$');
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
