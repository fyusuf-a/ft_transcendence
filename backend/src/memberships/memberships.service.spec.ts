import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import {
  DeleteResult,
  EntityNotFoundError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UpdateMembershipDto } from '@dtos/memberships';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { MockChannelEntity } from 'src/channels/mocks/channel.entity.mock';
import { ChannelType } from 'src/dtos/channels';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let membershipsRepository: Repository<Membership>;
  let channelsRepository: Repository<Channel>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: getRepositoryToken(Membership),
          useValue: new MockRepository(() => new Membership()),
        },
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(() => new MockUserEntity()),
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: new MockRepository(() => new MockChannelEntity()),
        },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
    channelsRepository = module.get<Repository<Channel>>(
      getRepositoryToken(Channel),
    );
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
        .spyOn(channelsRepository, 'findOneByOrFail')
        .mockImplementation(() => {
          throw new EntityNotFoundError('', '');
        });
      return expect(
        service.create({
          channelId: 5,
          userId: 10,
          role: MembershipRoleType.PARTICIPANT,
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('throws without user', async () => {
      const channel: Channel = new Channel();
      channel.id = 5;
      channel.type = ChannelType.PUBLIC;
      jest
        .spyOn(channelsRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(channel);
      jest.spyOn(usersRepository, 'findOneByOrFail').mockImplementation(() => {
        throw new EntityNotFoundError('', '');
      });
      return expect(
        service.create({
          channelId: 5,
          userId: 10,
          role: MembershipRoleType.PARTICIPANT,
        }),
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('returns a ResponseMembership', async () => {
      const channel: Channel = new Channel();
      channel.id = 5;
      const user: User = new User();
      user.id = 10;
      const membership = new Membership();
      jest
        .spyOn(channelsRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(channel);
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(user);
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

    it('returns a ResponseMembership if channel is private and creator is authorized', async () => {
      const channel: Channel = new Channel();
      channel.id = 5;
      channel.type = ChannelType.PRIVATE;
      const user: User = new User();
      user.id = 10;
      const membership = new Membership();
      jest
        .spyOn(channelsRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(channel);
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(user);
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

    it('returns a ResponseMembership if channel is protected and creator is authorized', async () => {
      const channel: Channel = new Channel();
      channel.id = 5;
      channel.type = ChannelType.PROTECTED;
      const user: User = new User();
      user.id = 10;
      const membership = new Membership();
      jest
        .spyOn(channelsRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(channel);
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(user);
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
        .spyOn(membershipsRepository, 'findOneByOrFail')
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
