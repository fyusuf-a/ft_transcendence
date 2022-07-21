import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import {
  CreateMembershipDto,
  UpdateMembershipDto,
  ResponseMembershipDto,
} from '@dtos/memberships';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';

describe('MembershipsController', () => {
  let controller: MembershipsController;
  let service: MembershipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipsController],
      providers: [
        MembershipsService,
        {
          provide: getRepositoryToken(Membership),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: jest.fn(),
        },
        {
          provide: Friendship,
          useValue: jest.fn(),
        },
        {
          provide: Block,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<MembershipsController>(MembershipsController);
    service = module.get<MembershipsService>(MembershipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a membership', async () => {
      const mockOut = new Membership();
      const expected = new ResponseMembershipDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if membership not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });

  describe('findAll()', () => {
    it('should return an array of membership', async () => {
      const mockOut = [new Membership()];
      const expected = [new ResponseMembershipDto()];
      jest.spyOn(service, 'findAll').mockImplementation(async () => mockOut);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('create()', () => {
    it('should return a ResponseMembershipDto', async () => {
      const mockMembership = new Membership();
      mockMembership.channelId = 1;
      mockMembership.userId = 0;
      mockMembership.role = MembershipRoleType.PARTICIPANT;
      const createMembershipDto = new CreateMembershipDto();
      createMembershipDto.channelId = 1;
      createMembershipDto.userId = 0;
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockMembership);
      const result = await controller.create(createMembershipDto);
      expect(result).toEqual(mockMembership);
    });

    it('should throw BadRequest if EntityDoesNotExist', async () => {
      const createMembershipDto = new CreateMembershipDto();
      createMembershipDto.channelId = 1;
      createMembershipDto.userId = 0;
      createMembershipDto.role = MembershipRoleType.PARTICIPANT;
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new EntityDoesNotExistError('error');
      });
      expect(controller.create(createMembershipDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if service throws', async () => {
      const createMembershipDto = new CreateMembershipDto();
      createMembershipDto.channelId = 1;
      createMembershipDto.userId = 0;
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new Error('error');
      });
      expect(controller.create(createMembershipDto)).rejects.toThrow(Error);
    });
  });

  describe('update()', () => {
    it('should return an UpdateResult', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateMembershipDto();
      dto.bannedUntil = new Date();
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
