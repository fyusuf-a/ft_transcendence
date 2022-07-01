import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { QueryFriendshipDto } from './dto/query-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipRepository } from './repositories/friendship.repository';

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

  findAll(query?: QueryFriendshipDto) {
    return this.friendshipRepository.find({ where: query });
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
