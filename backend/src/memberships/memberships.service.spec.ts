import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateMembershipDto } from '@dtos/memberships';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { MockChannelEntity } from 'src/channels/mocks/channel.entity.mock';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let membershipsRepository: Repository<Membership>;
  let channelsRepository: ChannelRepository;
  let usersRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: getRepositoryToken(Membership),
          useValue: new MockRepository(() => new Membership()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository(() => new MockUserEntity()),
        },
        {
          provide: getRepositoryToken(ChannelRepository),
          useValue: new MockRepository(() => new MockChannelEntity()),
        },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
    channelsRepository = module.get<ChannelRepository>(ChannelRepository);
    usersRepository = module.get<UserRepository>(UserRepository);
    membershipsRepository = module.get<Repository<Membership>>(
      getRepositoryToken(Membership),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('throws without channel', async () => {
      jest
        .spyOn(channelsRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      return expect(
        service.create({
          channelId: 5,
          userId: 10,
          role: MembershipRoleType.PARTICIPANT,
        }),
      ).rejects.toThrow(EntityDoesNotExistError);
    });

    it('throws without user', async () => {
      const channel: Channel = new Channel();
      channel.id = 5;
      jest.spyOn(channelsRepository, 'findOne').mockResolvedValueOnce(channel);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(undefined);
      return expect(
        service.create({
          channelId: 5,
          userId: 10,
          role: MembershipRoleType.PARTICIPANT,
        }),
      ).rejects.toThrow(EntityDoesNotExistError);
    });

    it('returns a ResponseMembership', async () => {
      const channel: Channel = new Channel();
      channel.id = 5;
      const user: User = new User();
      user.id = 10;
      const membership = new Membership();
      jest.spyOn(channelsRepository, 'findOne').mockResolvedValueOnce(channel);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(membershipsRepository, 'save')
        .mockResolvedValueOnce(membership);
      const result = await service.create({
        channelId: 5,
        userId: 10,
        role: MembershipRoleType.PARTICIPANT,
      });
      return expect(result).toMatchObject(membership);
    });
  });

  describe('findAll()', () => {
    it('returns a list of Membership', async () => {
      const expected = [new Membership(), new Membership()];
      jest.spyOn(membershipsRepository, 'find').mockResolvedValueOnce(expected);
      const results = await service.findAll();
      return expect(results).toEqual(expected);
    });
  });

  describe('findOne()', () => {
    it('returns a  Membership', async () => {
      const expected = new Membership();
      jest
        .spyOn(membershipsRepository, 'findOne')
        .mockResolvedValueOnce(expected);
      const results = await service.findOne(1);
      return expect(results).toEqual(expected);
    });
  });

  describe('update()', () => {
    it('returns an UpdateResult', async () => {
      const expected = new UpdateResult();
      jest
        .spyOn(membershipsRepository, 'update')
        .mockResolvedValueOnce(expected);
      const results = await service.update(1, new UpdateMembershipDto());
      return expect(results).toEqual(expected);
    });
  });

  describe('remove()', () => {
    it('returns a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest
        .spyOn(membershipsRepository, 'delete')
        .mockResolvedValueOnce(expected);
      const results = await service.remove(1);
      return expect(results).toEqual(expected);
    });
  });
});
