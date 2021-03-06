import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PageDto, PageMetaDto, PageOptionsDto, takeDefault } from '@dtos/pages';
import {
  CreateMatchDto,
  UpdateMatchDto,
  ResponseMatchDto,
  Match,
  MatchStatusType,
} from '@dtos/matches';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Match),
          useValue: jest.fn(),
        },
      ],
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
        Array(5).fill(new Match()),
        new PageMetaDto(new PageOptionsDto(), takeDefault),
      );
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne()', () => {
    it('should return a message', async () => {
      const mockOut = new Match();
      const expected = new ResponseMatchDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if match not found', async () => {
      const mockOut = undefined;
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      expect(controller.findOne('5')).rejects.toThrow('Not Found');
    });
  });

  describe('create()', () => {
    it('should return a ResponseMatchDto with a status of IN_PROGRESS', async () => {
      const match = new Match();
      match.homeId = 2;
      match.awayId = 3;
      match.status = MatchStatusType.IN_PROGRESS;
      const createMatchDto = new CreateMatchDto();
      createMatchDto.homeId = 2;
      createMatchDto.awayId = 3;
      jest.spyOn(service, 'create').mockImplementation(async () => {
        return match;
      });
      const result = await controller.create(createMatchDto);
      expect(result).toEqual(match);
    });
    it('should return Bad Request if a user does not exist or if the home user is the away user', async () => {
      const createMatchDto = new CreateMatchDto();
      createMatchDto.homeId = 2;
      createMatchDto.awayId = 3;
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => {
          throw new EntityDoesNotExistError('User #2 not found');
        })
        .mockImplementationOnce(async () => {
          throw new RangeError();
        });
      let result = controller.create(createMatchDto);
      expect(result).rejects.toThrow(BadRequestException);
      result = controller.create(createMatchDto);
      expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('update()', () => {
    it('should return an UpdateResult', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateMatchDto();
      dto.end = new Date();
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update('1', dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove('1');
      expect(result).toBe(expected);
    });
  });
});
