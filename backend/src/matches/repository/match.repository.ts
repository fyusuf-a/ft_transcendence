import { Match } from '../entities/match.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { QueryMatchDto } from '../dto/query-match.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PaginatedRepository } from '../../common/repository';
import { EntityRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Match)
export default class MatchRepository extends PaginatedRepository<Match> {
  public async findAllPaginated(
    query?: QueryMatchDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<Match>> {
    return this.findAllPaginated2(
      pageOptions,
      'match',
      'id',
      (selectQueryBuilder) => {
        let whereMethod = 'where';
        if (query?.homeId) {
          selectQueryBuilder[whereMethod]('match.homeId = :id', {
            id: query.homeId,
          });
          whereMethod = 'andWhere';
        }
        if (query?.awayId) {
          selectQueryBuilder[whereMethod]('match.awayId = :id', {
            id: query.awayId,
          });
          whereMethod = 'andWhere';
        }
        if (query?.role) {
          selectQueryBuilder[whereMethod]('match.role = :role', {
            role: query.role,
          });
        }
      },
    );
  }
}
