import { Match } from '../entities/match.entity';
import { QueryMatchDto } from '@dtos/matches/query-match.dto';
import { PageDto, PageOptionsDto } from '@dtos/pages';
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
