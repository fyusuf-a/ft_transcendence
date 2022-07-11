import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import UserRepository from './repository/user.repository';
import { FriendshipRepository } from 'src/relationships/friendships/repositories/friendship.repository';
import { BlockRepository } from 'src/relationships/blocks/repositories/blocks.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from 'src/casl/casl.module';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, CaslModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        UserRepository,
        {
          provide: UserRepository,
          useValue: jest.fn(),
        },
        {
          provide: FriendshipRepository,
          useValue: jest.fn(),
        },
        {
          provide: BlockRepository,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
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
      const result = await controller.findAll();
      expect(result.data).toEqual(expected);
    });
  });

  describe('create()', () => {
    it('should return a ResponseUserDto', async () => {
      const mockUser = new User();
      mockUser.identity = 'id';
      mockUser.username = 'user';
      const createUserDto = new CreateUserDto();
      createUserDto.identity = 'id';
      createUserDto.username = 'user';
      jest.spyOn(service, 'create').mockImplementation(async () => mockUser);
      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update()', () => {
    it('should return an UpdateResult', async () => {
      const mock = new UpdateResult();
      const userDto = new UpdateUserDto();
      userDto.username = 'user';
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const request = { user: new User() };
      request.user.id = 1;
      const result = await controller.update('1', userDto, request);
      expect(result).toEqual(mock);
    });
  });

  describe('findOne()', () => {
    it('should return a user', async () => {
      const mockOut = new User();
      const expected = new ResponseUserDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if user not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => new DeleteResult());
      jest.spyOn(configService, 'get').mockReturnValue(true);
      const result = await controller.remove('1');
      expect(result).toEqual(new DeleteResult());
    });
  });
});
