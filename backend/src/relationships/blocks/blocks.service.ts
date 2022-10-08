import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlockDto, QueryBlockDto, UpdateBlockDto } from '@dtos/blocks';
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

  async createFromUsername(
    username: string,
    createBlockDto: CreateBlockDto,
  ): Promise<Block> {
    const target: User = await this.userRepository.findOneByOrFail({
      username: username,
    });
    createBlockDto.targetId = target.id;
    return await this.create(createBlockDto, target);
  }

  async create(createBlockDto: CreateBlockDto, target: User = null) {
    const blocked: Block = new Block();
    blocked.source = await this.userRepository.findOneByOrFail({
      id: createBlockDto.sourceId,
    });
    blocked.sourceId = createBlockDto.sourceId;
    if (!target) {
      blocked.target = await this.userRepository.findOneByOrFail({
        id: createBlockDto.targetId,
      });
    } else blocked.target = target;
    blocked.targetId = createBlockDto.targetId;
    return await this.blockRepository.save(blocked);
  }

  findAll(query?: QueryBlockDto) {
    const findOptionsWhere: FindOptionsWhere<Block> = {
      source: query?.sourceId ? { id: +query.sourceId } : {},
      target: query?.targetId ? { id: +query.targetId } : {},
    };
    return this.blockRepository.find({ where: findOptionsWhere });
  }

  findOne(id: number): Promise<Block> {
    return this.blockRepository.findOneByOrFail({ id: id });
  }

  update(id: number, updateBlockDto: UpdateBlockDto): Promise<UpdateResult> {
    return this.blockRepository.update(id, updateBlockDto);
  }

  async remove(id: number) {
    return this.blockRepository.delete(id);
  }
}
