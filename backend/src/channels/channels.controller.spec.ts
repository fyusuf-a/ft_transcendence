import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

describe('ChannelsController', () => {
  let controller: ChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<ChannelsController>(ChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
