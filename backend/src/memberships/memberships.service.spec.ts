import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let channelsRepository: Repository<Channel>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: getRepositoryToken(Membership),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Channel),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
    channelsRepository = module.get<Repository<Channel>>(
      getRepositoryToken(Channel),
    );
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
