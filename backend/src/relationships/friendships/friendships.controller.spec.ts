import { Test, TestingModule } from '@nestjs/testing';

import { DeleteResult, UpdateResult } from 'typeorm';
import { ResponseFriendshipDto, UpdateFriendshipDto } from '@dtos/friendships';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

describe('FriendshipsController', () => {
  let controller: FriendshipsController;
  let service: FriendshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipsController],
      providers: [
        FriendshipsService,
        {
          provide: getRepositoryToken(Friendship),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<FriendshipsController>(FriendshipsController);
    service = module.get<FriendshipsService>(FriendshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a Friendship', async () => {
      const mockOut = new Friendship();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(new ResponseFriendshipDto());
    });
  });

  describe('update()', () => {
    it('should return a ResponseFriendshipDto', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateFriendshipDto();
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
