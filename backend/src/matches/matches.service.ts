import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateMatchDto,
  QueryMatchDto,
  UpdateMatchDto,
  ResponseMatchDto,
  MatchStatusType,
} from '@dtos/matches';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { Match } from './entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import { paginate } from 'src/common/paginate';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(
    query?: QueryMatchDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseMatchDto>> {
    const orderOptions = { id: pageOptions.order };
    const findOptionsWhere: FindOptionsWhere<Match> = {
      home: query?.homeId ? { id: +query.homeId } : {},
      away: query?.awayId ? { id: +query.awayId } : {},
      status: query?.role,
    };
    const response = await paginate(
      this.matchRepository,
      findOptionsWhere,
      orderOptions,
      pageOptions,
    );
    return response.convertData((x) => x);
  }

  findOne(id: number): Promise<ResponseMatchDto> {
    return this.matchRepository.findOneBy({ id: id });
  }

  async create(matchDto: CreateMatchDto): Promise<ResponseMatchDto> {
    const match: Match = new Match();
    match.home = await this.usersRepository.findOneBy({ id: matchDto.homeId });
    if (match.home === undefined) {
      throw new EntityDoesNotExistError(`User #${matchDto.homeId} not found`);
    }
    match.homeId = match.home.id;
    match.away = await this.usersRepository.findOneBy({ id: matchDto.awayId });
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
