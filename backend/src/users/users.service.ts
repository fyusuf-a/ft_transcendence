import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { createReadStream } from 'fs';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from '@dtos/users';
import { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';
import * as fs from 'fs';
import { ResponseFriendshipDto, FriendshipTypeEnum } from '@dtos/friendships';
import { FriendshipRepository } from 'src/relationships/friendships/repositories/friendship.repository';
import { ResponseBlockDto, BlockTypeEnum } from '@dtos/blocks';
import { BlockRepository } from 'src/relationships/blocks/repositories/blocks.repository';
import { AchievementsLogDto } from '@dtos/achievements-log';
import { AchievementsLogRepository } from 'src/achievements-log/repository/achievements-log.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    @InjectRepository(FriendshipRepository)
    private friendshipRepository: FriendshipRepository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
    @InjectRepository(AchievementsLogRepository)
    private achievementsLogRepository: AchievementsLogRepository,
  ) {}

  async findAll(
    query?: QueryUserDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<User>> {
    return this.usersRepository.findAllPaginated(query, pageOptions);
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
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
    const user: User = await this.usersRepository.findOne(id);
    if (user === undefined) {
      throw new EntityDoesNotExistError(`User #${id}`);
    }
    const filepath = user.avatar;
    if (filepath === null || !fs.existsSync(filepath)) {
      throw new EntityDoesNotExistError('Avatar');
    }
    const splitPath = filepath.split('.');
    const ext = splitPath[splitPath.length - 1];
    const stream = createReadStream(filepath);
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
}
