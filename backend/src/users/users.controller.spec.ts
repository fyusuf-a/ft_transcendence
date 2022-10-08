import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from '@dtos/users';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PageDto, PageMetaDto, PageOptionsDto } from '@dtos/pages';
import { DeleteResult, EntityNotFoundError, UpdateResult } from 'typeorm';
import { emptyRepositories } from 'src/common/mocks/empty.repositories.mock';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const user = { id: 1 } as User;

  beforeEach(async () => {
    const providers = [UsersService, CaslAbilityFactory] as any[];
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [UsersController],
      providers: providers.concat(emptyRepositories),
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const users = [new User(), new User()];
      const pageOptions = new PageOptionsDto(1, 2);
      const pageMeta = new PageMetaDto(pageOptions, 2);
      const mockOut = new PageDto<User>(users, pageMeta);
      const expected = [
        new ResponseUserDto(users[0]),
        new ResponseUserDto(users[1]),
      ];
      jest.spyOn(service, 'findAll').mockImplementation(async () => mockOut);
      const result = await controller.findAll(user);
      expect(result.data).toEqual(expected);
    });
  });

  describe('create()', () => {
    it.skip('should return a ResponseUserDto', async () => {
      const mockUser = new User();
      mockUser.identity = 'id';
      mockUser.username = 'user';
      const createUserDto = new CreateUserDto();
      createUserDto.identity = 'id';
      createUserDto.username = 'user';
      jest.spyOn(service, 'create').mockImplementation(async () => mockUser);
      const result = await controller.create(user, createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update()', () => {
    it.skip('should return an UpdateResult', async () => {
      const mock = new UpdateResult();
      const userDto = new UpdateUserDto();
      userDto.username = 'user';
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update(user, 1, userDto);
      expect(result).toEqual(mock);
    });
  });

  describe('findOne()', () => {
    it.skip('should return a user', async () => {
      const mockOut = new User();
      const expected = new ResponseUserDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne(user, 1);
      expect(result).toEqual(expected);
    });

    it('should return 404 if user not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        throw new EntityNotFoundError(User, '5');
      });
      expect(controller.findOne(user, 5)).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it.skip('should return a DeleteResult', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => new DeleteResult());
      const result = await controller.remove(user, 1);
      expect(result).toEqual(new DeleteResult());
    });
  });
});
