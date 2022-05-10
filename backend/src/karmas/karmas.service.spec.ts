import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Karma } from './entities/karma.entity';
import { KarmasService } from './karmas.service';

describe('KarmasService', () => {
  let service: KarmasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KarmasService,
        {
          provide: getRepositoryToken(Karma),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<KarmasService>(KarmasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
