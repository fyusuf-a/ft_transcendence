import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateFriendshipDto,
  QueryFriendshipDto,
  UpdateFriendshipDto,
  ResponseFriendshipDto,
} from '@dtos/friendships';
import { Friendship } from '../entities/friendship.entity';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { User } from 'src/users/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { paginate } from 'src/common/paginate';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createFromUsername(
    username: string,
    createFriendshipDto: CreateFriendshipDto,
  ): Promise<Friendship> {
    const target: User = await this.userRepository.findOneByOrFail({
      username: username,
    });
    createFriendshipDto.targetId = target.id;
    return await this.create(createFriendshipDto, target);
  }

  async create(createFriendshipDto: CreateFriendshipDto, target: User = null) {
    const friendship: Friendship = new Friendship();
    friendship.source = await this.userRepository.findOneByOrFail({
      id: createFriendshipDto.sourceId,
    });
    friendship.sourceId = createFriendshipDto.sourceId;
    if (!target) {
      friendship.target = await this.userRepository.findOneByOrFail({
        id: createFriendshipDto.targetId,
      });
    } else friendship.target = target;
    friendship.targetId = createFriendshipDto.targetId;
    return await this.friendshipRepository.save(friendship);
  }

  async findAll(
    query?: QueryFriendshipDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseFriendshipDto>> {
    const orderOptions = { id: pageOptions.order };
    const findOptionsWhere: FindOptionsWhere<Friendship> = {
      source: query?.sourceId ? { id: +query.sourceId } : {},
      target: query?.targetId ? { id: +query.targetId } : {},
      status: query?.status,
    };
    const response = await paginate(
      this.friendshipRepository,
      findOptionsWhere,
      orderOptions,
      pageOptions,
    );
    return response.convertData((x) => x);
  }

  findOne(id: number) {
    return this.friendshipRepository.findOneByOrFail({ id: id });
  }

  update(id: number, updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipRepository.update(id, updateFriendshipDto);
  }

  async remove(id: number) {
    return this.friendshipRepository.delete(id);
  }
}
