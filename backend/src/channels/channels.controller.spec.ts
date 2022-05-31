import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import ChannelRepository from './repository/channel.repository';

describe('ChannelsController', () => {
  let controller: ChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        ChannelsService,
        {
          provide: ChannelRepository,
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
