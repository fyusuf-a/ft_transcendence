import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { mockUserEntity } from './mocks/user.entity.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(() => new mockUserEntity()),
            find: jest.fn(() => [new mockUserEntity(), new mockUserEntity()]),
            save: jest.fn(() => new mockUserEntity()),
            delete: jest.fn(() => void {}),
          },
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
      expect(await service.findOne(0)).toEqual(new mockUserEntity());
    });
  });

  describe('when looking up an non-existing User by id', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(User),
            useValue: {
              findOne: jest.fn(() => undefined),
            },
          },
        ],
      }).compile();
      service = module.get<UsersService>(UsersService);
    });
    it('should return undefined', async () => {
      expect(await service.findOne(1)).toEqual(undefined);
    });
  });

  describe('when finding all Users', () => {
    it('should return array of User', async () => {
      const result = [new mockUserEntity(), new mockUserEntity()];
      const ret = await service.findAll();
      expect(ret).toEqual(result);
    });
  });

  describe('when creating a new User', () => {
    it('should return new user object', async () => {
      const userDto: CreateUserDto = new CreateUserDto();
      expect(await service.create(userDto)).toEqual(new mockUserEntity());
    });
  });

  describe('when removing a new User', () => {
    it('should return void', async () => {
      expect(await service.remove(0)).toBeUndefined();
    });
  });
});
