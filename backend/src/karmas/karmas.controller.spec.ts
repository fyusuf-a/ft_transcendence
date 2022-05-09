import { Test, TestingModule } from '@nestjs/testing';
import { KarmasController } from './karmas.controller';
import { KarmasService } from './karmas.service';

describe('KarmasController', () => {
  let controller: KarmasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KarmasController],
      providers: [KarmasService],
    }).compile();

    controller = module.get<KarmasController>(KarmasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
