import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
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

    service = module.get<KarmasService>(KarmasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
