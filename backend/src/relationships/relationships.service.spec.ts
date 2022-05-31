import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRepository from 'src/users/repository/user.repository';
import { User } from 'src/users/entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { RelationshipsService } from './relationships.service';
import { MockRepository } from 'src/common/mocks/repository.mock';

describe('RelationshipsService', () => {
  let service: RelationshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipsService,
        {
          provide: getRepositoryToken(Relationship),
          useValue: new MockRepository<Relationship>(new Relationship()),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<User>(new User()),
        },
      ],
    }).compile();

    service = module.get<RelationshipsService>(RelationshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
