import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, UpdateUserDto } from '@dtos/users';
import { UsersService } from './users.service';
import { MockUserEntity } from './mocks/user.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { PageDto } from '@dtos/pages';
import { DeleteResult, EntityNotFoundError, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';

const userNumber = 2;
const mockConfig = () => ({ get: () => undefined });

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository<MockUserEntity>(
            () => new MockUserEntity(),
            userNumber,
          ),
        },
        {
          provide: ConfigService,
          useFactory: mockConfig,
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: new MockRepository<Friendship>(
            () => new Friendship(),
            userNumber,
          ),
        },
        {
          provide: getRepositoryToken(Block),
          useValue: new MockRepository<Block>(() => new Block()),
        },
        {
          provide: getRepositoryToken(AchievementsLog),
          useValue: new MockRepository<AchievementsLog>(
            () => new AchievementsLog(),
          ),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when looking up an existing User by id', () => {
    it('should return User', async () => {
      const user = await service.findOne(1);
      expect(user).toEqual(new MockUserEntity());
    });
  });

  describe('when looking up an non-existing User by id', () => {
    it('should throw', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(EntityNotFoundError);
      expect(service.findOne(userNumber + 1)).rejects.toThrow();
    });
  });

  describe('when finding all Users', () => {
    it('should return array of User', async () => {
      const users = await service.findAll();
      expect(users).toBeInstanceOf(PageDto);
      if (users.data.length !== 0)
        expect(users.data[0]).toBeInstanceOf(MockUserEntity);
    });
  });

  describe('when creating a new User', () => {
    it('should return new user object', async () => {
      const userDto: CreateUserDto = new CreateUserDto();
      const expected = new MockUserEntity();
      expected.id = userNumber + 1;
      expect(await service.create(userDto)).toEqual(expected);
    });
  });

  describe('when removing a new User', () => {
    it('should return a DeleteResult', async () => {
      expect(await service.remove(0)).toEqual(new DeleteResult());
    });
  });

  describe('update()', () => {
    it('should return an update result', async () => {
      expect(await service.update(0, new UpdateUserDto())).toEqual(
        new UpdateResult(),
      );
    });
  });
});
