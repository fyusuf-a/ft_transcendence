import { SelectQueryBuilder, Repository } from 'typeorm';
import { PageDto, PageOptionsDto, PageMetaDto } from '@dtos/pages';

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
