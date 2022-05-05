import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResponseUserDto } from './dto/responseUser.dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const mockOut = [new User(), new User()];
      const expected = [
        new ResponseUserDto(mockOut[0]),
        new ResponseUserDto(mockOut[1]),
      ];
      jest.spyOn(service, 'findAll').mockImplementation(async () => mockOut);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });
});
