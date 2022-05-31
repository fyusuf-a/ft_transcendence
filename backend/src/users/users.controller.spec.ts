import { Test, TestingModule } from '@nestjs/testing';
import { ResponseUserDto } from './dto/response-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import UserRepository from './repository/user.repository';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UserRepository,
        {
          provide: UserRepository,
          useValue: jest.fn(),
        },
      ],
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
      const result = await controller.findAll();
      expect(result.data).toEqual(expected);
    });
  });

  describe('findOne()', () => {
    it('should return 404 if user not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });
});
