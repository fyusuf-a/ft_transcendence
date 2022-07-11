import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { Action } from './actions';
import { CaslAbilityFactory } from './casl-ability.factory';

describe('CaslAbilityFactory', () => {
  let caslAbilityFactory: CaslAbilityFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [CaslAbilityFactory],
    }).compile();

    caslAbilityFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
    configService = module.get<ConfigService>(ConfigService);
    jest.spyOn(configService, 'get').mockReturnValue(false);
  });

  describe('CaslAbilityFactory', () => {
    it('should be defined', () => {
      expect(caslAbilityFactory).toBeDefined();
    });

    it('createForUser should allow self modification', () => {
      const user = new User();
      user.id = 1;
      const ability = caslAbilityFactory.createForUser(user);
      expect(ability.can(Action.Update, user)).toBe(true);
    });

    it('createForUser should forbid modification of others', () => {
      const user = new User();
      user.id = 1;
      const otherUser = new User();
      user.id = 2;
      const ability = caslAbilityFactory.createForUser(user);
      expect(ability.can(Action.Update, otherUser)).toBe(false);
    });
  });
});
