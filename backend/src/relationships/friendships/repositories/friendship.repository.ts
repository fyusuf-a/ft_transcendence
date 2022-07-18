import { PageDto, PageOptionsDto } from '@dtos/pages';
import { QueryFriendshipDto } from '@dtos/friendships';
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
