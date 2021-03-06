import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
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

  async create(createFriendshipDto: CreateFriendshipDto) {
    const friendship: Friendship = new Friendship();
    friendship.source = await this.userRepository.findOneBy({
      id: createFriendshipDto.sourceId,
    });
    friendship.sourceId = createFriendshipDto.sourceId;
    if (
      friendship.source === undefined ||
      friendship.source.id !== friendship.sourceId
    ) {
      throw new EntityDoesNotExistError(
        `User #${createFriendshipDto.sourceId}`,
      );
    }

    friendship.target = await this.userRepository.findOneBy({
      id: createFriendshipDto.targetId,
    });
    friendship.targetId = createFriendshipDto.targetId;
    if (
      friendship.target === undefined ||
      friendship.target.id !== friendship.targetId
    ) {
      throw new EntityDoesNotExistError(
        `User #${createFriendshipDto.targetId}`,
      );
    }

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
    return this.friendshipRepository.findOneBy({ id: id });
  }

  update(id: number, updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipRepository.update(id, updateFriendshipDto);
  }

  async remove(id: number) {
    return this.friendshipRepository.delete(id);
  }
}
