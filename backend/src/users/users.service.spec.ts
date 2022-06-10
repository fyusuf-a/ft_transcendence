import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { MockUserEntity } from './mocks/user.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import UserRepository from './repository/user.repository';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

const userNumber = 2;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<MockUserEntity>(
            new MockUserEntity(),
            userNumber,
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
      const user = await service.findOne(0);
      expect(user).toEqual(new MockUserEntity());
    });
  });

  describe('when looking up an non-existing User by id', () => {
    it('should return undefined', async () => {
      expect(await service.findOne(3)).toEqual(undefined);
    });
  });

  describe('when finding all Users', () => {
    it('should return array of User', async () => {
      const pageOptions = new PageOptionsDto();
      const entities = Array(
        userNumber > pageOptions.take ? pageOptions.take : userNumber,
      ).fill(new MockUserEntity());
      const pageMetaDto = new PageMetaDto(pageOptions, entities.length);
      const result = new PageDto(entities, pageMetaDto);

      const ret = await service.findAll();
      expect(ret).toEqual(result);
    });
  });

  describe('when creating a new User', () => {
    it('should return new user object', async () => {
      const userDto: CreateUserDto = new CreateUserDto();
      expect(await service.create(userDto)).toEqual(new MockUserEntity());
    });
  });

  describe('when removing a new User', () => {
    it('should return void', async () => {
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
