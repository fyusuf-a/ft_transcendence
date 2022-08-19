import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from '@dtos/users';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import { ResponseFriendshipDto, FriendshipTypeEnum } from '@dtos/friendships';
import { ResponseBlockDto, BlockTypeEnum } from '@dtos/blocks';
import { AchievementsLogDto } from '@dtos/achievements-log';
import { Block } from 'src/relationships/entities/block.entity';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { paginate } from 'src/common/paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';

enum hexSignature {
  GIF = '47494638',
  JPG = 'FFD8FF',
  PNG = '89504E47',
}

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

  remove_avatar(filePath: string, reason: string) {
    const logger: Logger = new Logger('remove_avatar');
    fs.unlink(filePath, (err) => {
      if (err) logger.error(err);
      else logger.log('Deleted ' + filePath + reason);
    });
  }

  async updateAvatar(userId: number, filepath: string) {
    const user: User = await this.usersRepository.findOneByOrFail({
      id: userId,
    });
    if (filepath != user.avatar)
      this.remove_avatar(user.avatar, ' remplacing with new avatar.');
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

  findFriendships(id: number): Promise<ResponseFriendshipDto[]> {
    return this.friendshipRepository.find({
      where: [
        { targetId: id, status: FriendshipTypeEnum.ACCEPTED },
        { sourceId: id, status: FriendshipTypeEnum.ACCEPTED },
      ],
    });
  }

  findFriendRequests(id: number): Promise<ResponseFriendshipDto[]> {
    return this.friendshipRepository.find({
      where: { targetId: id, status: FriendshipTypeEnum.PENDING },
    });
  }

  findBlocks(id: number): Promise<ResponseBlockDto[]> {
    return this.blockRepository.find({
      where: [
        { sourceId: id, status: BlockTypeEnum.MUTUAL },
        { targetId: id, status: BlockTypeEnum.MUTUAL },
        { sourceId: id, status: BlockTypeEnum.S_BLOCKS_T },
        { targetId: id, status: BlockTypeEnum.T_BLOCKS_S },
      ],
    });
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
    this.remove_avatar(filePath, ' invalid signature.');
    return false;
  }
}
