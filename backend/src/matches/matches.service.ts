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

  async updateUsersStatus(home: User, away: User, status: UserStatusEnum) {
    home.status = !home.status ? UserStatusEnum.offline : status;
    away.status = !away.status ? UserStatusEnum.offline : status;
    await this.usersRepository.save([home, away]);
    this.notificationGateway.handleMatchStatusUpdate(
      home,
      await this.usersService.findFriendships(home.id, 1),
      away,
      await this.usersService.findFriendships(away.id, 1),
    );
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
    this.updateUsersStatus(match.home, match.away, UserStatusEnum.ingame);
    this.notificationGateway.handleMatchStatusUpdate(
      match.home,
      await this.usersService.findFriendships(match.homeId, 1),
      match.away,
      await this.usersService.findFriendships(match.awayId, 1),
    );
    match.start = new Date();
    return this.matchRepository.save(match);
  }

  async update(
    match: Match,
    updateMatchDto: UpdateMatchDto,
  ): Promise<UpdateResult> {
    const home: User = await this.usersService.findOne(match.homeId);
    const away: User = await this.usersService.findOne(match.awayId);
    this.updateUsersStatus(home, away, UserStatusEnum.online);
    return await this.matchRepository.update(match.id, updateMatchDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
