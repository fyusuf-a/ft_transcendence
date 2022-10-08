import { Test, TestingModule } from '@nestjs/testing';

import { DeleteResult, UpdateResult } from 'typeorm';
import { ResponseFriendshipDto, UpdateFriendshipDto } from '@dtos/friendships';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { emptyRepositories } from 'src/common/mocks/empty.repositories.mock';
import { User } from 'src/users/entities/user.entity';

describe('FriendshipsController', () => {
  let controller: FriendshipsController;
  let service: FriendshipsService;
  const user = { id: 1 } as User;

  beforeEach(async () => {
    const providers = [CaslAbilityFactory, FriendshipsService] as any[];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipsController],
      providers: providers.concat(emptyRepositories),
    }).compile();

    controller = module.get<FriendshipsController>(FriendshipsController);
    service = module.get<FriendshipsService>(FriendshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it.skip('should return a Friendship', async () => {
      const mockOut = new Friendship();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne(user, '1');
      expect(result).toEqual(new ResponseFriendshipDto());
    });
  });

  describe('update()', () => {
    it.skip('should return a ResponseFriendshipDto', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateFriendshipDto();
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
