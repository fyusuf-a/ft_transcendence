import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRepository from 'src/users/repository/user.repository';
import { Block } from './entities/block.entity';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';

describe('BlocksController', () => {
  let controller: BlocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlocksController],
      providers: [
        BlocksService,
        {
          provide: getRepositoryToken(Block),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<BlocksController>(BlocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
