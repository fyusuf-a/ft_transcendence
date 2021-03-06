import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { MockRepository } from 'src/common/mocks/repository.mock';
import { MockUserEntity } from 'src/users/mocks/user.entity.mock';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { Match } from './entities/match.entity';
import { CreateMatchDto, UpdateMatchDto, MatchStatusType } from '@dtos/matches';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

const userNumber = 2;
const matchNumber = 2;

describe('MatchesService', () => {
  let service: MatchesService;
  let usersRepository: Repository<User>;
  let matchRepository: Repository<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository<MockUserEntity>(
            () => new MockUserEntity(),
            userNumber,
          ),
        },
        {
          provide: getRepositoryToken(Match),
          useValue: new MockRepository(() => new Match(), matchNumber),
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
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
      jest
        .spyOn(matchRepository, 'findAndCount')
        .mockReturnValue(Promise.resolve([[new Match(), new Match()], 2]));
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
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValueOnce(home)
        .mockResolvedValueOnce(away);
      jest.spyOn(matchRepository, 'save').mockResolvedValueOnce(match);
      const result = await service.create(createMatchDto);
      expect(result).toEqual(match);
    });

    it('should throw EntityDoesNotExistError if the home user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockReturnValue(undefined);
      expect(service.create(createMatchDto)).rejects.toThrow(
        EntityDoesNotExistError,
      );
    });

    it('should throw EntityDoesNotExistError if the away user does not exist', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValueOnce(home)
        .mockResolvedValueOnce(undefined);
      expect(service.create(createMatchDto)).rejects.toThrow(
        EntityDoesNotExistError,
      );
    });
    it('should throw RangeError if the home user is the away user', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
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
