import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Karma } from './entities/karma.entity';
import { KarmasController } from './karmas.controller';
import { KarmasService } from './karmas.service';

describe('KarmasController', () => {
  let controller: KarmasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KarmasController],
      providers: [
        KarmasService,
        {
          provide: getRepositoryToken(Karma),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<KarmasController>(KarmasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
