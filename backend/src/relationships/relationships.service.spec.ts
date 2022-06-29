import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  Relationship,
  RelationshipTypeEnum,
} from './entities/relationship.entity';
import { RelationshipsService } from './relationships.service';
import { MockRepository } from 'src/common/mocks/repository.mock';

describe('RelationshipsService', () => {
  let service: RelationshipsService;
  let usersRepository: Repository<User>;
  let relationshipsRepository: Repository<Relationship>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipsService,
        {
          provide: getRepositoryToken(Relationship),
          useValue: new MockRepository<Relationship>(() => new Relationship()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<User>(() => new User()),
        },
      ],
    }).compile();

    service = module.get<RelationshipsService>(RelationshipsService);
    usersRepository = module.get<UserRepository>(UserRepository);
    relationshipsRepository = module.get<Repository<Relationship>>(
      getRepositoryToken(Relationship),
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
          type: RelationshipTypeEnum.FRIEND,
        });
      }
      const user2 = new User();
      user2.id = 2;
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(undefined))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2));

      expect(tryCreate()).rejects.toThrow(EntityDoesNotExistError);
    });

    it('should throw without valid targetId', async () => {
      async function tryCreate() {
        return await service.create({
          sourceId: 2,
          targetId: 1,
          type: RelationshipTypeEnum.FRIEND,
        });
      }
      const user2 = new User();
      user2.id = 2;
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(undefined));

      expect(tryCreate()).rejects.toThrow(EntityDoesNotExistError);
    });

    it('should return relationship with valid users', async () => {
      async function tryCreate() {
        return await service.create({
          sourceId: 2,
          targetId: 1,
          type: RelationshipTypeEnum.FRIEND,
        });
      }
      const user2 = new User();
      user2.id = 2;
      const user1 = new User();
      user1.id = 1;
      const relationship1 = new Relationship();
      relationship1.sourceId = user2.id;
      relationship1.targetId = user1.id;
      jest
        .spyOn(usersRepository, 'findOne')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user2))
        .mockImplementationOnce((): Promise<any> => Promise.resolve(user1));

      jest
        .spyOn(relationshipsRepository, 'save')
        .mockImplementation((): Promise<any> => Promise.resolve(relationship1));

      expect(tryCreate()).resolves.toBeInstanceOf(Relationship);
    });
  });
});
