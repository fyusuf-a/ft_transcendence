import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { Membership } from './entities/membership.entity';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

describe('MembershipsController', () => {
  let controller: MembershipsController;

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
      ],
    }).compile();

    controller = module.get<MembershipsController>(MembershipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
