import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { MockUserEntity } from './mocks/user.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import UserRepository from './repository/user.repository';
import { PageDto } from '../common/dto/page.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';

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
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<MockUserEntity>(
            () => new MockUserEntity(),
            userNumber,
          ),
        },
        {
          provide: ConfigService,
          useFactory: mockConfig,
        },
      ],
      controllers: [UsersController],
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
    it('should return undefined', async () => {
      expect(await service.findOne(userNumber + 1)).toEqual(undefined);
    });
  });

  describe('when finding all Users', () => {
    it('should return array of User', async () => {
      const messages = await service.findAll();
      expect(messages).toBeInstanceOf(PageDto);
      if (messages.data.length !== 0)
        expect(messages.data[0]).toBeInstanceOf(MockUserEntity);
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
