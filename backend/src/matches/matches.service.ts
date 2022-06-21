import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { Injectable } from '@nestjs/common';
import { QueryMatchDto } from './dto/query-match.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { ResponseMatchDto } from './dto/response-match.dto';
import UserRepository from 'src/users/repository/user.repository';
import MatchRepository from './repository/match.repository';
import { MatchStatusType } from 'src/matches/entities/match.entity';
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
    match.start = new Date();
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
    match.start = new Date();
    return this.matchRepository.save(match);
  }

  update(id: number, matchDto: UpdateMatchDto): Promise<UpdateResult> {
    return this.matchRepository.update(id, matchDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
