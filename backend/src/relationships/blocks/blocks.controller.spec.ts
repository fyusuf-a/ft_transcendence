import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DeleteResult, UpdateResult } from 'typeorm';
import { ResponseBlockDto, UpdateBlockDto } from '@dtos/blocks';
import { Block } from '../entities/block.entity';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { User } from 'src/users/entities/user.entity';

describe('BlocksController', () => {
  let controller: BlocksController;
  let service: BlocksService;

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
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<BlocksController>(BlocksController);
    service = module.get<BlocksService>(BlocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a Block', async () => {
      const mockOut = new Block();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(new ResponseBlockDto());
    });
  });

  describe('update()', () => {
    it('should return a ResponseBlockDto', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateBlockDto();
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
