import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from '@dtos/users';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import {
  ResponseFriendshipDto,
  FriendshipTypeEnum,
  ListFriendshipDto,
} from '@dtos/friendships';
import { BlockTypeEnum, ListBlockDto } from '@dtos/blocks';
import { AchievementsLogDto } from '@dtos/achievements-log';
import { Block } from 'src/relationships/entities/block.entity';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { paginate } from 'src/common/paginate';
import {
  DeleteResult,
  FindManyOptions,
  In,
  EntityNotFoundError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { plainToInstance } from 'class-transformer';
import { Match } from 'src/matches/entities/match.entity';
import { MatchStatusType, ResponseMatchDto } from 'src/dtos/matches';

enum hexSignature {
  GIF = '47494638',
  JPG = 'FFD8FF',
  PNG = '89504E47',
}

@Injectable()
export class UsersService {
  logger: Logger;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(AchievementsLog)
    private achievementsLogRepository: Repository<AchievementsLog>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {
    this.logger = new Logger('remove_avatar');
  }

  async findAll(
    query?: QueryUserDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<User>> {
    const orderOptions = { id: pageOptions.order };
    return await paginate(
      this.usersRepository,
      query,
      orderOptions,
      pageOptions,
    );
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id: id });
  }

  findByName(username: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({
      username: username,
    });
  }

  // Find by 42 pseudo
  findByMarvinId(marvinId: string): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { identity: marvinId },
    });
  }

  create(userDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(userDto);
  }

  update(id: number, userDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository.update(id, userDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  remove_avatar(filePath: string, reason: string) {
    if (!fs.existsSync(filePath)) {
      return;
    }
    fs.unlink(filePath, (err) => {
      if (err) this.logger.error(err);
      else this.logger.log('Deleted ' + filePath + reason);
    });
  }

  async updateAvatar(userId: number, filepath: string) {
    const user: User = await this.usersRepository.findOneByOrFail({
      id: userId,
    });
    if (filepath != user.avatar)
      this.remove_avatar(user.avatar, ': remplacing with new avatar.');
    return this.usersRepository.update(userId, { avatar: filepath });
  }

  async getAvatar(id: number) {
    const user: User = await this.usersRepository.findOneByOrFail({ id: id });
    const filepath = user.avatar;
    if (filepath === null || !fs.existsSync(filepath)) {
      throw new EntityNotFoundError('Avatar', '');
    }
    const splitPath = filepath.split('.');
    const ext = splitPath[splitPath.length - 1];
    const stream = fs.createReadStream(filepath);
    return { fileStream: new StreamableFile(stream), ext: ext };
  }

  async findFriendships(
    id: number,
    mode: number,
  ): Promise<ListFriendshipDto[]> {
    const options: FindManyOptions = mode
      ? {
          where: [
            { targetId: id, status: FriendshipTypeEnum.ACCEPTED },
            { sourceId: id, status: FriendshipTypeEnum.ACCEPTED },
          ],
        }
      : {
          where: { targetId: id, status: FriendshipTypeEnum.PENDING },
        };

    const tmp: ResponseFriendshipDto[] = await this.friendshipRepository.find(
      options,
    );

    const ids: number[] = [];
    const ret: ListFriendshipDto[] = [];

    for (let i = 0; i < tmp.length; i++) {
      ids.push(tmp[i].targetId == id ? tmp[i].sourceId : tmp[i].targetId);
    }

    const friends: User[] = await this.usersRepository.find({
      where: {
        id: In(ids),
      },
    });

    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < friends.length; j++) {
        if (ids[i] == friends[j].id) {
          const uUd: UpdateUserDto = {
            username: friends[j].username,
            avatar: friends[j].avatar,
          };
          ret[i] = new ListFriendshipDto(tmp[i], uUd);
          break;
        }
      }
    }
    return ret;
  }

  async findBlocks(id: number): Promise<ListBlockDto[]> {
    const tmp: Block[] = await this.blockRepository.find({
      where: [
        { sourceId: id, status: BlockTypeEnum.MUTUAL },
        { targetId: id, status: BlockTypeEnum.MUTUAL },
        { sourceId: id, status: BlockTypeEnum.S_BLOCKS_T },
        { targetId: id, status: BlockTypeEnum.T_BLOCKS_S },
      ],
    });
    const ids: number[] = [];
    const ret: ListBlockDto[] = [];

    for (let i = 0; i < tmp.length; i++) {
      ids.push(tmp[i].targetId == id ? tmp[i].sourceId : tmp[i].targetId);
    }

    const blocks: User[] = await this.usersRepository.find({
      where: {
        id: In(ids),
      },
    });

    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < blocks.length; j++) {
        if (ids[i] == blocks[j].id) {
          const uUd: UpdateUserDto = {
            username: blocks[j].username,
          };
          ret[i] = new ListBlockDto(tmp[i], uUd);
          break;
        }
      }
    }
    return ret;
  }

  findUnlockedAchievements(id: number): Promise<AchievementsLogDto[]> {
    return this.achievementsLogRepository.find({
      where: {
        userId: id,
      },
    });
  }

  verifyMagicNum(filePath: string): boolean {
    const data: string = fs
      .readFileSync(filePath, { encoding: 'hex' })
      .slice(0, 8)
      .toUpperCase();

    if (
      data == hexSignature.GIF ||
      data == hexSignature.PNG ||
      data.slice(0, 6) == hexSignature.JPG
    )
      return true;
    this.remove_avatar(filePath, ': invalid signature.');
    return false;
  }

  async setTwoFASecret(secret: string, userId: number): Promise<UpdateResult> {
    const updateDto = plainToInstance(UpdateUserDto, {
      twoFASecret: secret,
    });
    return this.update(userId, updateDto);
  }

  async setTwoFA(bool: boolean, userId: number): Promise<UpdateResult> {
    const updateDto = plainToInstance(UpdateUserDto, {
      isTwoFAEnabled: bool,
    });
    return this.update(userId, updateDto);
  }

  async findMatches(id: number): Promise<ResponseMatchDto[]> {
    return this.matchRepository.findBy([
      { status: MatchStatusType.HOME, awayId: id },
      { status: MatchStatusType.AWAY, awayId: id },
      { status: MatchStatusType.DRAW, awayId: id },
      { status: MatchStatusType.HOME, homeId: id },
      { status: MatchStatusType.AWAY, homeId: id },
      { status: MatchStatusType.DRAW, homeId: id },
    ]);
  }
}
