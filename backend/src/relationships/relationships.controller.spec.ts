import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from 'src/common/mocks/repository.mock';
import UserRepository from 'src/users/repository/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ResponseRelationshipDto } from './dto/response-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { Relationship } from './entities/relationship.entity';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

describe('RelationshipsController', () => {
  let controller: RelationshipsController;
  let service: RelationshipsService;

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
    service = module.get<RelationshipsService>(RelationshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a Relationship', async () => {
      const mockOut = new Relationship();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(new ResponseRelationshipDto());
    });
  });

  describe('update()', () => {
    it('should return a ResponseRelationshipDto', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateRelationshipDto();
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update('1', dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove('1');
      expect(result).toBe(expected);
    });
  });
});
