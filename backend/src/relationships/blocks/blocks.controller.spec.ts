import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ResponseBlockDto, UpdateBlockDto } from '@dtos/blocks';
import { Block } from '../entities/block.entity';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { emptyRepositories } from 'src/common/mocks/empty.repositories.mock';
import { User } from 'src/users/entities/user.entity';

describe('BlocksController', () => {
  let controller: BlocksController;
  let service: BlocksService;
  const user = { id: 1 } as User;

  beforeEach(async () => {
    const providers = [CaslAbilityFactory, BlocksService] as any[];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlocksController],
      providers: providers.concat(emptyRepositories),
    }).compile();

    controller = module.get<BlocksController>(BlocksController);
    service = module.get<BlocksService>(BlocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it.skip('should return a Block', async () => {
      const mockOut = new Block();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne(user, '1');
      expect(result).toEqual(new ResponseBlockDto());
    });
  });

  describe('update()', () => {
    it.skip('should return a ResponseBlockDto', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateBlockDto();
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update(user, '1', dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove()', () => {
    it.skip('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove(user, '1');
      expect(result).toBe(expected);
    });
  });
});
