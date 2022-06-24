import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import { Repository } from 'typeorm';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { QueryFriendshipDto } from './dto/query-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { Friendship } from './entities/friendship.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
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

    const ret = await this.friendshipRepository.save(friendship);
    friendship.source.friendshipsIds.push(friendship.id);
    this.userRepository.update(friendship.sourceId, friendship.source);
    friendship.target.friendshipsIds.push(friendship.id);
    this.userRepository.update(friendship.targetId, friendship.target);
    await this.userRepository.save(friendship.source);
    await this.userRepository.save(friendship.target);
    return ret;
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

  remove_from_user(user: User, id: number) {
    const index = user.friendshipsIds.indexOf(id);
    if (index > -1) {
      user.friendshipsIds.splice(index, 1);
    }
    this.userRepository.update(user.id, user);
    this.userRepository.save(user);
  }

  async remove(id: number) {
    const friendship = await this.findOne(id);
    const target = await this.userRepository.findOne(friendship.targetId);
    const source = await this.userRepository.findOne(friendship.sourceId);

    this.remove_from_user(target, id);
    this.remove_from_user(source, id);
    return this.friendshipRepository.delete(id);
  }
}
