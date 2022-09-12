import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from 'src/common/mocks/repository.mock';

import { User } from 'src/users/entities/user.entity';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipsService } from './friendships.service';

describe('friendshipsService', () => {
  let service: FriendshipsService;
  let usersRepository: Repository<User>;
  let friendshipsRepository: Repository<Friendship>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipsService,
        {
          provide: getRepositoryToken(Friendship),
          useValue: new MockRepository(() => new Friendship()),
        },
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(() => new MockUserEntity()),
        },
      ],
    }).compile();

    service = module.get<FriendshipsService>(FriendshipsService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    friendshipsRepository = module.get<Repository<Friendship>>(
      getRepositoryToken(Friendship),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw without valid sourceId', async () => {
      async function tryCreate() {
        return await service.create({
          sourceId: 1,
          targetId: 2,
        });
      }
      const user2 = new User();
      user2.id = 2;
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockRejectedValue(new EntityNotFoundError('', ''));

      expect(tryCreate()).rejects.toThrow(EntityNotFoundError);
    });

    it('should throw without valid targetId', async () => {
      async function tryCreate() {
        return await service.create({
          sourceId: 2,
          targetId: 1,
        });
      }
      const user2 = new User();
      user2.id = 2;
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockRejectedValue(new EntityNotFoundError('', ''));

      expect(tryCreate()).rejects.toThrow(EntityNotFoundError);
    });

    it('should return friendship with valid users', async () => {
      async function tryCreate() {
        return await service.create({
          sourceId: 2,
          targetId: 1,
        });
      }
      const user2 = new User();
      user2.id = 2;
      const user1 = new User();
      user1.id = 1;
      const friendship1 = new Friendship();
      friendship1.sourceId = user2.id;
      friendship1.targetId = user1.id;
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user1));

      jest
        .spyOn(friendshipsRepository, 'save')
        .mockImplementation((): Promise<any> => Promise.resolve(friendship1));

      expect(tryCreate()).resolves.toBeInstanceOf(Friendship);
    });
  });
});
