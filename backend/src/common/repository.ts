import { SelectQueryBuilder, Repository } from 'typeorm';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

export class PaginatedRepository<T> extends Repository<T> {
  async findAllPaginated2(
    pageOptions?: PageOptionsDto,
    alias = '',
    orderingColumn = 'id',
    customizer?: (a: SelectQueryBuilder<T>) => void,
  ): Promise<PageDto<T>> {
    const queryBuilder = this.createQueryBuilder(alias);
    queryBuilder
      .orderBy(`${alias}.${orderingColumn}`, pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);
    if (customizer) customizer(queryBuilder);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto(pageOptions, itemCount);
    return new PageDto(entities, pageMetaDto);
  }
}
