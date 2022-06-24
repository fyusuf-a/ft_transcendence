import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRepository from 'src/users/repository/user.repository';
import { User } from 'src/users/entities/user.entity';
import { Friendship } from './entities/friendship.entity';
import { FriendshipsService } from './friendships.service';
import { MockRepository } from 'src/common/mocks/repository.mock';

describe('FriendshipsService', () => {
  let service: FriendshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipsService,
        {
          provide: getRepositoryToken(Friendship),
          useValue: new MockRepository<Friendship>(new Friendship()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<User>(new User()),
        },
      ],
    }).compile();

    service = module.get<FriendshipsService>(FriendshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
