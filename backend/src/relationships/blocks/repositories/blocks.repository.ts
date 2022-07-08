import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { QueryBlockDto } from '../dto/query-block.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { PaginatedRepository } from '../../../common/repository';
import { EntityRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Block } from '../../entities/block.entity';

@Injectable()
@EntityRepository(Block)
export class BlockRepository extends PaginatedRepository<Block> {
  public async findAllPaginated(
    query?: QueryBlockDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<Block>> {
    return this.findAllPaginated2(
      pageOptions,
      'Block',
      'id',
      (selectQueryBuilder) => {
        if (query?.status) {
          selectQueryBuilder.where('Block.status = :status', {
            id: query.status,
          });
        }
      },
    );
  }
}
