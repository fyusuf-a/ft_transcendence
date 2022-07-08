import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import { UpdateResult } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { QueryBlockDto } from './dto/query-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Block, BlockTypeEnum } from '../entities/block.entity';
import { BlockRepository } from './repositories/blocks.repository';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: BlockRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(createBlockDto: CreateBlockDto) {
    const previous = await this.blockRepository.findOne({
      where: {
        sourceId: createBlockDto.targetId,
        targetId: createBlockDto.sourceId,
      },
    });
    if (previous != undefined) {
      previous.status = BlockTypeEnum.MUTUAL;
      await this.blockRepository.update(previous.id, previous);
      return previous;
    }

    console.log('creating block entity');
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
    return await this.blockRepository.save(block);
  }

  findAll(query?: QueryBlockDto) {
    return this.blockRepository.find({ where: query });
  }

  findOne(id: number): Promise<Block> {
    return this.blockRepository.findOne(id);
  }

  update(id: number, updateBlockDto: UpdateBlockDto): Promise<UpdateResult> {
    return this.blockRepository.update(id, updateBlockDto);
  }

  async remove(id: number) {
    /*
      Here we should probably check if the block is mutual,
      in which case we should switch it T_BLOCKS_S or 
      S_BLOCKS_T rather than deleting it, but it is meaningless
      as long as we do not have a way to verify the user identity.
      */
    return this.blockRepository.delete(id);
  }
}
