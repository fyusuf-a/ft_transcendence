import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';
import { MockRepository } from 'src/common/mocks/repository.mock';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let channelsRepository: ChannelRepository;
  let usersRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: getRepositoryToken(Membership),
          useValue: new MockRepository<Membership>(new Membership()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<User>(new User()),
        },
        {
          provide: getRepositoryToken(ChannelRepository),
          useValue: new MockRepository<Channel>(new Channel()),
        },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
    channelsRepository = module.get<ChannelRepository>(ChannelRepository);
    usersRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() throws without channel', async () => {
    jest.spyOn(channelsRepository, 'findOne').mockResolvedValueOnce(undefined);
    try {
      await service.create({
        channelId: 5,
        userId: 10,
        role: MembershipRoleType.PARTICIPANT,
      });
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        return expect(true).toBe(true);
      } else {
        throw error;
      }
    }
    return expect(false).toBe(true);
  });

  it('create() throws without user', async () => {
    const channel: Channel = new Channel();
    channel.id = 5;
    jest.spyOn(channelsRepository, 'findOne').mockResolvedValueOnce(channel);
    jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(undefined);
    try {
      await service.create({
        channelId: 5,
        userId: 10,
        role: MembershipRoleType.PARTICIPANT,
      });
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        return expect(true).toBe(true);
      }
    }
    return expect(false).toBe(true);
  });
});
