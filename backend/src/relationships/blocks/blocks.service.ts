import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import { Repository } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { QueryBlockDto } from './dto/query-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Block } from './entities/block.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(createBlockDto: CreateBlockDto) {
    const block: Block = new Block();
    block.source = await this.userRepository.findOne(createBlockDto.sourceId);
    block.sourceId = createBlockDto.sourceId;

    if (block.source === undefined || block.source.id !== block.sourceId) {
      throw new EntityDoesNotExistError(`User #${createBlockDto.sourceId}`);
    }
    block.target = await this.userRepository.findOne(createBlockDto.targetId);
    block.targetId = createBlockDto.targetId;
    if (block.target === undefined || block.target.id !== block.targetId) {
      throw new EntityDoesNotExistError(`User #${createBlockDto.targetId}`);
    }

    const ret = await this.blockRepository.save(block);
    block.source.blocksIds.push(block.id);
    this.userRepository.update(block.sourceId, block.source);
    block.target.blocksIds.push(block.id);
    this.userRepository.update(block.targetId, block.target);
    await this.userRepository.save(block.source);
    await this.userRepository.save(block.target);
    return ret;
  }

  findAll(query?: QueryBlockDto) {
    return this.blockRepository.find({ where: query });
  }

  findOne(id: number) {
    return this.blockRepository.findOne(id);
  }

  update(id: number, updateBlockDto: UpdateBlockDto) {
    return this.blockRepository.update(id, updateBlockDto);
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
    const block = await this.findOne(id);
    const target = await this.userRepository.findOne(block.targetId);
    const source = await this.userRepository.findOne(block.sourceId);

    this.remove_from_user(target, id);
    this.remove_from_user(source, id);
    return this.blockRepository.delete(id);
  }
}
