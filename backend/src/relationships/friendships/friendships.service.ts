import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import {
  CreateFriendshipDto,
  QueryFriendshipDto,
  UpdateFriendshipDto,
  ResponseFriendshipDto,
} from '@dtos/friendships';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipRepository } from './repositories/friendship.repository';
import { PageDto, PageOptionsDto } from '@dtos/pages';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(FriendshipRepository)
    private friendshipRepository: FriendshipRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(createFriendshipDto: CreateFriendshipDto) {
    const friendship: Friendship = new Friendship();
    friendship.source = await this.userRepository.findOne(
      createFriendshipDto.sourceId,
    );
    friendship.sourceId = createFriendshipDto.sourceId;
    if (
      friendship.source === undefined ||
      friendship.source.id !== friendship.sourceId
    ) {
      throw new EntityDoesNotExistError(
        `User #${createFriendshipDto.sourceId}`,
      );
    }

    friendship.target = await this.userRepository.findOne(
      createFriendshipDto.targetId,
    );
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
    const response = await this.friendshipRepository.findAllPaginated(
      query,
      pageOptions,
    );
    return response.convertData((x) => x);
  }

  findOne(id: number) {
    return this.friendshipRepository.findOne(id);
  }

  update(id: number, updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipRepository.update(id, updateFriendshipDto);
  }

  async remove(id: number) {
    return this.friendshipRepository.delete(id);
  }
}
