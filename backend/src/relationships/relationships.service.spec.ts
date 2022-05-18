import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { RelationshipsService } from './relationships.service';

describe('RelationshipsService', () => {
  let service: RelationshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipsService,
        {
          provide: getRepositoryToken(Relationship),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<RelationshipsService>(RelationshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
