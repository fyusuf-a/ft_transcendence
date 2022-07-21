import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import {
  CreateBlockDto,
  QueryBlockDto,
  UpdateBlockDto,
  BlockTypeEnum,
} from '@dtos/blocks';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { Block } from '../entities/block.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    const block: Block = new Block();
    block.source = await this.userRepository.findOneBy({
      id: createBlockDto.sourceId,
    });
    block.sourceId = createBlockDto.sourceId;
    if (block.source === undefined || block.source.id !== block.sourceId) {
      throw new EntityDoesNotExistError(`User #${createBlockDto.sourceId}`);
    }

    block.target = await this.userRepository.findOneBy({
      id: createBlockDto.targetId,
    });
    block.targetId = createBlockDto.targetId;
    if (block.target === undefined || block.target.id !== block.targetId) {
      throw new EntityDoesNotExistError(`User #${createBlockDto.targetId}`);
    }
    return await this.blockRepository.save(block);
  }

  findAll(query?: QueryBlockDto) {
    const findOptionsWhere: FindOptionsWhere<Block> = {
      source: query?.sourceId ? { id: +query.sourceId } : {},
      target: query?.targetId ? { id: +query.targetId } : {},
      status: query?.status,
    };
    return this.blockRepository.find({ where: findOptionsWhere });
  }

  findOne(id: number): Promise<Block> {
    return this.blockRepository.findOneBy({ id: id });
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
