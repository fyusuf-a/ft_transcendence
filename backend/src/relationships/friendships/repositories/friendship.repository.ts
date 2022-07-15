import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { QueryFriendshipDto } from '../dto/query-friendship.dto';
import { PageDto } from '../../../common/dto/page.dto';
import { PaginatedRepository } from '../../../common/repository';
import { EntityRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Friendship } from '../../entities/friendship.entity';

@Injectable()
@EntityRepository(Friendship)
export class FriendshipRepository extends PaginatedRepository<Friendship> {
  public async findAllPaginated(
    query?: QueryFriendshipDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<Friendship>> {
    return this.findAllPaginated2(
      pageOptions,
      'friendship',
      'id',
      (selectQueryBuilder) => {
        let whereMethod = 'where';
        if (query?.status) {
          selectQueryBuilder[whereMethod]('friendship.status = :status', {
            status: query.status,
          });
          whereMethod = 'andWhere';
        }
        if (query?.sourceId) {
          selectQueryBuilder[whereMethod]('friendship.sourceId = :id', {
            id: query.sourceId,
          });
        }
      },
    );
  }
}
