import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import {
  CreateMatchDto,
  QueryMatchDto,
  UpdateMatchDto,
  ResponseMatchDto,
  MatchStatusType,
} from '@dtos/matches';
import { Match } from './entities/match.entity';
import { User, UserStatusEnum } from 'src/users/entities/user.entity';
import { paginate } from 'src/common/paginate';
import { NotificationsGateway } from 'src/notifications.gateway';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(NotificationsGateway)
    private readonly notificationGateway: NotificationsGateway,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  async findAll(
    query?: QueryMatchDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseMatchDto>> {
    const orderOptions = { id: pageOptions.order };
    const findOptionsWhere: FindOptionsWhere<Match> = {
      home: query?.homeId ? { id: +query.homeId } : {},
      away: query?.awayId ? { id: +query.awayId } : {},
      status: query?.status,
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
    return this.matchRepository.findOneByOrFail({ id: id });
  }

  async updateUsersStatus(match: Match, status: UserStatusEnum) {
    match.home.status = !match.home.status ? UserStatusEnum.offline : status;
    match.away.status = !match.away.status ? UserStatusEnum.offline : status;
    await this.usersRepository.save([match.home, match.away]);
  }
  async create(matchDto: CreateMatchDto): Promise<ResponseMatchDto> {
    const match: Match = new Match();
    match.home = await this.usersRepository.findOneByOrFail({
      id: matchDto.homeId,
    });
    match.homeId = match.home.id;
    match.away = await this.usersRepository.findOneByOrFail({
      id: matchDto.awayId,
    });
    match.awayId = match.away.id;
    match.status = MatchStatusType.IN_PROGRESS;
    if (match.homeId === match.awayId) {
      throw new RangeError('Home and away cannot be the same');
    }
    this.updateUsersStatus(match, UserStatusEnum.ingame);
    this.notificationGateway.handleMatchStatusUpdate(
      match.home,
      await this.usersService.findFriendships(match.homeId, 1),
      match.away,
      await this.usersService.findFriendships(match.awayId, 1),
    );
    return this.matchRepository.save(match);
  }

  async update(id: number, matchDto: UpdateMatchDto): Promise<UpdateResult> {
    const match: Match = await this.matchRepository.findOneByOrFail({ id: id });
    if (
      match.status == MatchStatusType.IN_PROGRESS &&
      matchDto.status != MatchStatusType.IN_PROGRESS
    ) {
      this.updateUsersStatus(match, UserStatusEnum.online);
      await this.usersRepository.save([match.home, match.away]);
      this.notificationGateway.handleMatchStatusUpdate(
        match.home,
        await this.usersService.findFriendships(match.homeId, 1),
        match.away,
        await this.usersService.findFriendships(match.awayId, 1),
      );
    }
    return this.matchRepository.update(id, matchDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
