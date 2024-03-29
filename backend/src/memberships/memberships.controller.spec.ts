import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
import { ChannelsService } from 'src/channels/channels.service';
import { ChannelType } from 'src/dtos/channels';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('MembershipsController', () => {
  const user: User = new User();
  user.id = 5;
  let controller: MembershipsController;
  let service: MembershipsService;
  let channelsService: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipsController],
      providers: [
        MembershipsService,
        ChannelsService,
        ConfigService,
        {
          provide: EventEmitter2,
          useValue: jest.fn(),
        },
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
    channelsService = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it.skip('should return a membership', async () => {
      const mockOut = new Membership();
      const expected = new ResponseMembershipDto();
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(mockOut));
      expect(controller.findOne(user, '1')).resolves.toEqual(expected);
    });
  });

  describe('findAll()', () => {
    it.skip('should return an array of membership', async () => {
      const mockOut = [new Membership()];
      const expected = [new ResponseMembershipDto()];
      jest.spyOn(service, 'findAll').mockImplementation(async () => mockOut);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('create()', () => {
    it.skip('should return a ResponseMembershipDto', async () => {
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
      const mockChannel = new Channel();
      mockChannel.type = ChannelType.PUBLIC;
      jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
      const result = await controller.create(user, createMembershipDto);
      expect(result).toEqual(mockMembership);
    });

    // it('should throw BadRequest if EntityDoesNotExist', async () => {
    //   const createMembershipDto = new CreateMembershipDto();
    //   createMembershipDto.channelId = 1;
    //   createMembershipDto.userId = 0;
    //   createMembershipDto.role = MembershipRoleType.PARTICIPANT;
    //   jest.spyOn(service, 'create').mockImplementation(async () => {
    //     throw new EntityNotFoundError('', '');
    //   });
    //   const mockChannel = new Channel();
    //   mockChannel.type = ChannelType.PUBLIC;
    //   jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
    //   expect(
    //     controller.create(createMembershipDto, mockRequest),
    //   ).rejects.toThrow(BadRequestException);
    // });

    //   it('should throw if service throws', async () => {
    //     const createMembershipDto = new CreateMembershipDto();
    //     createMembershipDto.channelId = 1;
    //     createMembershipDto.userId = 0;
    //     jest.spyOn(service, 'create').mockImplementation(async () => {
    //       throw new Error('error');
    //     });
    //     const mockChannel = new Channel();
    //     mockChannel.type = ChannelType.PUBLIC;
    //     jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
    //     expect(
    //       controller.create(createMembershipDto, mockRequest),
    //     ).rejects.toThrow(Error);
    //   });
  });

  describe('create() on PRIVATE channel', () => {
    it.skip('should return a ResponseMembershipDto if creator is admin', async () => {
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
      const mockChannel = new Channel();
      mockChannel.type = ChannelType.PRIVATE;
      jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
      const mockCreatorMembership = new Membership();
      mockCreatorMembership.role = MembershipRoleType.ADMIN;
      jest.spyOn(service, 'findAll').mockResolvedValue([mockCreatorMembership]);
      const result = await controller.create(user, createMembershipDto);
      expect(result).toEqual(mockMembership);
    });

    // it('should throw if not authorized', async () => {
    //   const createMembershipDto = new CreateMembershipDto();
    //   createMembershipDto.channelId = 1;
    //   createMembershipDto.userId = 0;
    //   createMembershipDto.role = MembershipRoleType.PARTICIPANT;
    //   jest.spyOn(service, 'create').mockImplementation(async () => {
    //     throw new EntityNotFoundError('', '');
    //   });
    //   const mockChannel = new Channel();
    //   mockChannel.type = ChannelType.PRIVATE;
    //   const mockCreatorMembership = new Membership();
    //   mockCreatorMembership.role = MembershipRoleType.PARTICIPANT;
    //   jest.spyOn(service, 'findAll').mockResolvedValue([mockCreatorMembership]);
    //   jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
    //   expect(
    //     controller.create(createMembershipDto, mockRequest),
    //   ).rejects.toThrow(BadRequestException);
    // });
  });

  describe('create() on PROTECTED channel', () => {
    it.skip('should return a ResponseMembershipDto', async () => {
      const mockMembership = new Membership();
      mockMembership.channelId = 1;
      mockMembership.userId = 0;
      mockMembership.role = MembershipRoleType.PARTICIPANT;
      const createMembershipDto = new CreateMembershipDto();
      createMembershipDto.channelId = 1;
      createMembershipDto.userId = 0;
      createMembershipDto.password = 'password';
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockMembership);
      const mockChannel = new Channel();
      mockChannel.type = ChannelType.PROTECTED;
      mockChannel.password =
        '$2b$10$/.KrB7B.amqoVxsqLHo.YuVl1Dhfw60L9Q9N.U3csybePzXqifZeS';
      jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
      const result = await controller.create(user, createMembershipDto);
      expect(result).toEqual(mockMembership);
    });

    // it('should throw if not authorized', async () => {
    //   const mockMembership = new Membership();
    //   mockMembership.channelId = 1;
    //   mockMembership.userId = 0;
    //   mockMembership.role = MembershipRoleType.PARTICIPANT;
    //   const createMembershipDto = new CreateMembershipDto();
    //   createMembershipDto.channelId = 1;
    //   createMembershipDto.userId = 0;
    //   createMembershipDto.password = 'badpassword';
    //   jest
    //     .spyOn(service, 'create')
    //     .mockImplementation(async () => mockMembership);
    //   const mockChannel = new Channel();
    //   mockChannel.type = ChannelType.PROTECTED;
    //   mockChannel.password =
    //     '$2b$10$/.KrB7B.amqoVxsqLHo.YuVl1Dhfw60L9Q9N.U3csybePzXqifZeS';
    //   jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
    //   expect(
    //     controller.create(createMembershipDto, mockRequest),
    //   ).rejects.toThrow(UnauthorizedException);
    // });

    describe('create elevated memberships', () => {
      //   it('should throw if role is owner', () => {
      //     const mockResult = new Membership();
      //     jest.spyOn(service, 'create').mockResolvedValue(mockResult);
      //     const dto = new CreateMembershipDto();
      //     dto.role = MembershipRoleType.OWNER;
      //     dto.channelId = 5;
      //     const mockCreatorMembership = new Membership();
      //     mockCreatorMembership.role = MembershipRoleType.OWNER;
      //     mockCreatorMembership.channelId = 5;
      //     jest
      //       .spyOn(service, 'findAll')
      //       .mockResolvedValue([mockCreatorMembership]);
      //     jest.spyOn(service, 'findOne').mockResolvedValue(mockCreatorMembership);
      //     const mockChannel = new Channel();
      //     mockChannel.id = 5;
      //     mockChannel.type = ChannelType.PUBLIC;
      //     jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
      //     expect(controller.create(dto, mockRequest)).rejects.toThrow(
      //       UnauthorizedException,
      //     );
      //   });

      // it('should throw if role is admin and creator is non-owner', () => {
      //   const mockResult = new Membership();
      //   jest.spyOn(service, 'create').mockResolvedValue(mockResult);
      //   const dto = new CreateMembershipDto();
      //   dto.role = MembershipRoleType.ADMIN;
      //   dto.channelId = 5;
      //   const mockCreatorMembership = new Membership();
      //   mockCreatorMembership.role = MembershipRoleType.ADMIN;
      //   mockCreatorMembership.channelId = 5;
      //   jest
      //     .spyOn(service, 'findAll')
      //     .mockResolvedValue([mockCreatorMembership]);
      //   jest.spyOn(service, 'findOne').mockResolvedValue(mockCreatorMembership);
      //   const mockChannel = new Channel();
      //   mockChannel.id = 5;
      //   mockChannel.type = ChannelType.PUBLIC;
      //   jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
      //   expect(controller.create(dto, mockRequest)).rejects.toThrow(
      //     UnauthorizedException,
      //   );
      // });

      it.skip('should return Result if role is admin and creator is owner', () => {
        const mockResult = new Membership();
        jest.spyOn(service, 'create').mockResolvedValue(mockResult);
        const dto = new CreateMembershipDto();
        dto.role = MembershipRoleType.ADMIN;
        dto.channelId = 5;
        const mockCreatorMembership = new Membership();
        mockCreatorMembership.role = MembershipRoleType.OWNER;
        mockCreatorMembership.channelId = 5;
        jest
          .spyOn(service, 'findAll')
          .mockResolvedValue([mockCreatorMembership]);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockCreatorMembership);
        const mockChannel = new Channel();
        mockChannel.id = 5;
        mockChannel.type = ChannelType.PUBLIC;
        jest.spyOn(channelsService, 'findOne').mockResolvedValue(mockChannel);
        expect(controller.create(user, dto)).resolves.toEqual(mockResult);
      });
    });
  });

  describe('update()', () => {
    it.skip('should return an UpdateResult', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateMembershipDto();
      dto.bannedUntil = new Date();
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update(user, '1', dto);
      expect(result).toEqual(mock);
    });

    // it('should throw when non-owner makes a user an admin', () => {
    //   const dto = new UpdateMembershipDto();
    //   dto.role = MembershipRoleType.ADMIN;
    //   const mockCreatorMembership = new Membership();
    //   mockCreatorMembership.role = MembershipRoleType.PARTICIPANT;
    //   mockCreatorMembership.channelId = 5;
    //   jest.spyOn(service, 'findAll').mockResolvedValue([mockCreatorMembership]);
    //   jest.spyOn(service, 'findOne').mockResolvedValue(mockCreatorMembership);
    //   expect(controller.update('1', dto, mockRequest)).rejects.toThrow(
    //     UnauthorizedException,
    //   );
    // });

    it('should return a Result when owner makes a user an admin', () => {
      const mockResult = new UpdateResult();
      jest.spyOn(service, 'update').mockImplementation(async () => mockResult);
      const dto = new UpdateMembershipDto();
      dto.role = MembershipRoleType.ADMIN;
      const mockCreatorMembership = new Membership();
      mockCreatorMembership.role = MembershipRoleType.OWNER;
      mockCreatorMembership.channelId = 5;
      jest.spyOn(service, 'findAll').mockResolvedValue([mockCreatorMembership]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCreatorMembership);
      expect(controller.update(user, '1', dto)).resolves.toEqual(mockResult);
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
