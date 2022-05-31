import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './channels.service';
import { MockChannelEntity } from './mocks/channel.entity.mock';
import { MockRepository } from 'src/common/mocks/repository.mock';
import ChannelRepository from './repository/channel.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

const entityNumber = 2;

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(ChannelRepository),
          useValue: new MockRepository<MockChannelEntity>(
            new MockChannelEntity(),
            entityNumber,
          ),
        },
      ],
    }).compile();
    service = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
