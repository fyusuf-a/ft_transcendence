import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import { Membership } from './entities/membership.entity';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

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
          provide: getRepositoryToken(UserRepository),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(ChannelRepository),
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
    it('should return 404 if membership not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });
});
