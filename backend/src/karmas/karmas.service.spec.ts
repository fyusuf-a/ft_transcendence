import { Test, TestingModule } from '@nestjs/testing';
import { KarmasService } from './karmas.service';

describe('KarmasService', () => {
  let service: KarmasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KarmasService],
    }).compile();

    service = module.get<KarmasService>(KarmasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
