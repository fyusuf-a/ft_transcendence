import { Channel } from '../../channels/entities/channel.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { QueryChannelDto } from '../dto/query-channel.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PaginatedRepository } from '../../common/repository';
import { EntityRepository } from 'typeorm';

@EntityRepository(Channel)
export default class ChannelRepository extends PaginatedRepository<Channel> {
  public async findAllPaginated(
    query?: QueryChannelDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<Channel>> {
    return this.findAllPaginated2(
      pageOptions,
      'channel',
      'id',
      (selectQueryBuilder) => {
        let whereMethod = 'where';
        if (query?.name) {
          selectQueryBuilder[whereMethod]('channel.name = :name', {
            name: query.name,
          });
          whereMethod = 'andWhere';
        }
        if (query?.type) {
          selectQueryBuilder[whereMethod]('channel.type = :type', {
            type: query.type,
          });
        }
      },
    );
  }
}
