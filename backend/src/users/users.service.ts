import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { createReadStream } from 'fs';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';
import * as fs from 'fs';
import { ResponseFriendshipDto } from 'src/relationships/friendships/dto/response-friendship.dto';
import { FriendshipRepository } from 'src/relationships/friendships/repositories/friendship.repository';
import { ResponseBlockDto } from 'src/relationships/blocks/dto/response-block.dto';
import { BlockRepository } from 'src/relationships/blocks/repositories/blocks.repository';
import { BlockTypeEnum } from 'src/relationships/entities/block.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    @InjectRepository(FriendshipRepository)
    private friendshipRepository: FriendshipRepository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
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
      where: [{ targetId: id }, { sourceId: id }],
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
}
