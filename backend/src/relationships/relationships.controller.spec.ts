import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRepository from 'src/users/repository/user.repository';
import { Relationship } from './entities/relationship.entity';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

describe('RelationshipsController', () => {
  let controller: RelationshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationshipsController],
      providers: [
        RelationshipsService,
        {
          provide: getRepositoryToken(Relationship),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<RelationshipsController>(RelationshipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
