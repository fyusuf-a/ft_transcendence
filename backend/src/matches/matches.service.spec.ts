import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import UserRepository from 'src/users/repository/user.repository';
import MatchRepository from './repository/match.repository';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { Match } from './entities/match.entity';
import { CreateMatchDto, UpdateMatchDto, MatchStatusType } from '@dtos/matches';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

const userNumber = 2;
const matchNumber = 2;

describe('MatchesService', () => {
  let service: MatchesService;
  let usersRepository: UserRepository;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: new MockRepository<MockUserEntity>(
            () => new MockUserEntity(),
            userNumber,
          ),
        },
        {
          provide: getRepositoryToken(MatchRepository),
          useValue: new MockRepository(() => new Match(), matchNumber),
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    usersRepository = module.get<UserRepository>(UserRepository);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('when looking up an existing Match, should return a Match', async () => {
      const match = new Match();
      match.id = 1;
      expect(await service.findOne(1)).toEqual(match);
    });

    it('when looking up a non-existing Match, should return undefined', async () => {
      expect(await service.findOne(matchNumber + 1)).toEqual(undefined);
    });
  });

  describe('findAll', () => {
    it('should return array of matches', async () => {
      const ret = await service.findAll();
      expect(ret.data.length).toBe(matchNumber);
    });
  });

  describe('create()', () => {
    const match = new Match();
    const home = new User();
    const away = { ...home };
    const createMatchDto = new CreateMatchDto();
    beforeAll(() => {
      match.homeId = 1;
      match.awayId = 2;
      match.status = MatchStatusType.IN_PROGRESS;
      createMatchDto.homeId = match.homeId;
      createMatchDto.awayId = match.awayId;
      home.id = match.homeId;
      away.id = match.awayId;
    });
    it('should return a ResponseMatchDto with a status of IN_PROGRESS', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValueOnce(home)
        .mockResolvedValueOnce(away);
      jest.spyOn(matchRepository, 'save').mockResolvedValueOnce(match);
      const result = await service.create(createMatchDto);
      expect(result).toEqual(match);
    });

    it('should throw EntityDoesNotExistError if the home user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockReturnValue(undefined);
      expect(service.create(createMatchDto)).rejects.toThrow(
        EntityDoesNotExistError,
      );
    });

    it('should throw EntityDoesNotExistError if the away user does not exist', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValueOnce(home)
        .mockResolvedValueOnce(undefined);
      expect(service.create(createMatchDto)).rejects.toThrow(
        EntityDoesNotExistError,
      );
    });
    it('should throw RangeError if the home user is the away user', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValueOnce(home)
        .mockResolvedValueOnce(home);
      expect(service.create(createMatchDto)).rejects.toThrow(RangeError);
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      expect(await service.remove(1)).toBeInstanceOf(DeleteResult);
    });
  });

  describe('update()', () => {
    it('should return an UpdateResult', async () => {
      expect(await service.update(1, new UpdateMatchDto())).toEqual(
        new UpdateResult(),
      );
    });
  });
});
