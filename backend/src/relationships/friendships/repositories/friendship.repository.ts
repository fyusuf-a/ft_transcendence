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
        if (query?.status) {
          selectQueryBuilder.where('friendship.status = :status', {
            id: query.status,
          });
        }
      },
    );
  }
}
