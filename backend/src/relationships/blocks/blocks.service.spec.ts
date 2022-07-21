import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';

import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Block } from '../entities/block.entity';
import { BlocksService } from './blocks.service';
import { MockRepository } from 'src/common/mocks/repository.mock';

describe('BlocksService', () => {
  let service: BlocksService;
  let usersRepository: Repository<User>;
  let BlocksRepository: Repository<Block>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: getRepositoryToken(Block),
          useValue: new MockRepository<Block>(() => new Block()),
        },
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository<User>(() => new User()),
        },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    BlocksRepository = module.get<Repository<Block>>(getRepositoryToken(Block));
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
        .spyOn(usersRepository, 'findOneBy')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(undefined))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2));

      expect(tryCreate()).rejects.toThrow(EntityDoesNotExistError);
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
        .spyOn(usersRepository, 'findOneBy')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(undefined));

      expect(tryCreate()).rejects.toThrow(EntityDoesNotExistError);
    });

    it('should return Block with valid users', async () => {
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
      const Block1 = new Block();
      Block1.sourceId = user2.id;
      Block1.targetId = user1.id;
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user1));

      jest
        .spyOn(BlocksRepository, 'save')
        .mockImplementation((): Promise<any> => Promise.resolve(Block1));

      expect(tryCreate()).resolves.toBeInstanceOf(Block);
    });
  });
});
