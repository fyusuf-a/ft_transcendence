import { Test, TestingModule } from '@nestjs/testing';
import { PageDto, PageMetaDto, PageOptionsDto, takeDefault } from '@dtos/pages';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, EntityNotFoundError, UpdateResult } from 'typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto } from '@dtos/channels';
import { Channel, ChannelType } from './entities/channel.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Friendship } from '../relationships/entities/friendship.entity';
import { Block } from '../relationships/entities/block.entity';
import { Message } from '../messages/entities/message.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { AchievementsLog } from '../achievements-log/entities/achievements-log.entity';
import { Match } from '../matches/entities/match.entity';

describe('ChannelsController', () => {
  let controller: ChannelsController;
  let service: ChannelsService;
  let membershipService: MembershipsService;
  const user = { id: 1 } as User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        ChannelsService,
        MembershipsService,
        ConfigService,
        CaslAbilityFactory,
        {
          provide: EventEmitter2,
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Channel),
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
          provide: getRepositoryToken(Message),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Achievement),
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
          provide: getRepositoryToken(User),
          useValue: new MockRepository(() => new User()),
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: new MockRepository(() => new Membership()),
        },
      ],
    }).compile();

    controller = module.get<ChannelsController>(ChannelsController);
    service = module.get<ChannelsService>(ChannelsService);
    membershipService = module.get<MembershipsService>(MembershipsService);
    jest.spyOn(membershipService, 'hasUserRoleInChannel').mockImplementation();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of channels', async () => {
      const pageOptions = new PageOptionsDto(1, 2);
      const expected = new PageDto(
        [],
        new PageMetaDto(pageOptions, takeDefault),
      );
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      const result = await controller.findAll(user);
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
      const result = await controller.create(user, createChannelDto);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('update()', () => {
    it('should return a ResponseChannelDto', async () => {
      const mock = new UpdateResult();
      const channelDto = new UpdateChannelDto();
      channelDto.name = 'user';
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update(user, '1', channelDto);
      expect(result).toEqual(mock);
    });
  });

  describe('findOne()', () => {
    it('should return a channel if it is public', async () => {
      const mockOut = new Channel();
      mockOut.type = ChannelType.PUBLIC;
      const expected = new Channel();
      expected.type = ChannelType.PUBLIC;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne(user, '1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if channel not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        throw new EntityNotFoundError(Channel, '5');
      });
      expect(controller.findOne(user, '5')).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove(user, '1');
      expect(result).toBe(expected);
    });
  });
});
