import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, EntityNotFoundError } from 'typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PageDto, PageMetaDto, PageOptionsDto, takeDefault } from '@dtos/pages';
import {
  CreateMatchDto,
  ResponseMatchDto,
  MatchDto,
  MatchStatusType,
} from '@dtos/matches';
import { User } from 'src/users/entities/user.entity';
import { Match } from './entities/match.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { emptyRepositories } from 'src/common/mocks/empty.repositories.mock';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;
  const user: User = { id: 1 } as User;

  beforeEach(async () => {
    const providers = [
      CaslAbilityFactory,
      MatchesService,
      NotificationsGateway,
      UsersService,
      ConfigService,
    ] as any[];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: providers.concat(emptyRepositories),
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of messages', async () => {
      const expected = new PageDto(
        Array(5).fill(new MatchDto()),
        new PageMetaDto(new PageOptionsDto(), takeDefault),
      );
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      const result = await controller.findAll(user);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne()', () => {
    it.skip('should return a message', async () => {
      const mockOut = new Match();
      const expected = new ResponseMatchDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne(user, '1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if match not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(EntityNotFoundError);
      expect(controller.findOne(user, '5')).rejects.toThrow();
    });
  });

  describe('create()', () => {
    it.skip('should return a ResponseMatchDto with a status of IN_PROGRESS', async () => {
      const match = new MatchDto();
      match.homeId = 2;
      match.awayId = 3;
      match.status = MatchStatusType.IN_PROGRESS;
      const createMatchDto = new CreateMatchDto();
      createMatchDto.homeId = 2;
      createMatchDto.awayId = 3;
      jest.spyOn(service, 'create').mockImplementation(async () => {
        return match;
      });
      const result = await controller.create(user, createMatchDto);
      expect(result).toEqual(match);
    });
    it.skip('should return Bad Request if a user does not exist or if the home user is the away user', async () => {
      const createMatchDto = new CreateMatchDto();
      createMatchDto.homeId = 2;
      createMatchDto.awayId = 3;
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new EntityNotFoundError('User #2 not found', ''),
        );
      const result = controller.create(user, createMatchDto);
      expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('remove()', () => {
    it.skip('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove(user, '1');
      expect(result).toBe(expected);
    });
  });
});
