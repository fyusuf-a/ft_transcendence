import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
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
  Repository,
  UpdateResult,
} from 'typeorm';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(AchievementsLog)
    private achievementsLogRepository: Repository<AchievementsLog>,
  ) {}

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
    return this.usersRepository.findOneOrFail({
      where: { username: username },
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

  updateAvatar(userId: number, filepath: string) {
    return this.usersRepository.update(userId, { avatar: filepath });
  }

  async getAvatar(id: number) {
    const user: User = await this.usersRepository.findOneBy({ id: id });
    if (user === undefined) {
      throw new EntityDoesNotExistError(`User #${id}`);
    }
    const filepath = user.avatar;
    if (filepath === null || !fs.existsSync(filepath)) {
      throw new EntityDoesNotExistError('Avatar');
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
      for (let j = 0; j < friends.length; j++)
      {
        if (ids[i] == friends[j].id)
        {
          const uUd: UpdateUserDto = {
            username: friends[j].username,
            avatar: friends[j].avatar,
          };
          ret[i] = new ListFriendshipDto(tmp[i], uUd);
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
      ret[i] = { username: blocks[i].username, avatar: blocks[i].avatar, id: tmp[i].id };
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
}
