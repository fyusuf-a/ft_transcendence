import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { mockChannelEntity } from './mocks/channel.entity.mock';

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            findOne: jest.fn(() => new mockChannelEntity()),
            find: jest.fn(() => [new mockChannelEntity(), new mockChannelEntity()]),
            save: jest.fn(() => new mockChannelEntity()),
            delete: jest.fn(() => void {}),
          },
        },
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
