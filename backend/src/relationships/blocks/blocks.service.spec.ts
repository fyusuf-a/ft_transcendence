import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRepository from 'src/users/repository/user.repository';
import { User } from 'src/users/entities/user.entity';
import { Block } from './entities/block.entity';
import { BlocksService } from './blocks.service';
import { MockRepository } from 'src/common/mocks/repository.mock';

describe('BlocksService', () => {
  let service: BlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: getRepositoryToken(Block),
          useValue: new MockRepository<Block>(new Block()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<User>(new User()),
        },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
