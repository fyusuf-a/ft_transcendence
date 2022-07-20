import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { Injectable } from '@nestjs/common';
import {
  CreateMatchDto,
  QueryMatchDto,
  UpdateMatchDto,
  ResponseMatchDto,
  MatchStatusType,
} from '@dtos/matches';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import MatchRepository from './repository/match.repository';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchRepository)
    private readonly matchRepository: MatchRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(
    query?: QueryMatchDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseMatchDto>> {
    const response = await this.matchRepository.findAllPaginated(
      query,
      pageOptions,
    );
    return response.convertData((x) => x);
  }

  findOne(id: number): Promise<ResponseMatchDto> {
    return this.matchRepository.findOne(id);
  }

  async create(matchDto: CreateMatchDto): Promise<ResponseMatchDto> {
    const match: Match = new Match();
    match.home = await this.userRepository.findOne(matchDto.homeId);
    if (match.home === undefined) {
      throw new EntityDoesNotExistError(`User #${matchDto.homeId} not found`);
    }
    match.homeId = match.home.id;
    match.away = await this.userRepository.findOne(matchDto.awayId);
    if (match.away === undefined) {
      throw new EntityDoesNotExistError(`User #${matchDto.awayId} not found`);
    }
    match.awayId = match.away.id;
    match.status = MatchStatusType.IN_PROGRESS;
    if (match.homeId === match.awayId) {
      throw new RangeError('Home and away cannot be the same');
    }
    return this.matchRepository.save(match);
  }

  update(id: number, matchDto: UpdateMatchDto): Promise<UpdateResult> {
    return this.matchRepository.update(id, matchDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
