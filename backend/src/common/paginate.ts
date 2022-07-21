import { PageDto, PageMetaDto, PageOptionsDto } from '@dtos/pages';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm';

interface Identifiable {
  id: number;
}

interface FindAndCountable<Entity> {
  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
}

export async function paginate<Entity extends Identifiable>(
  repository: FindAndCountable<Entity>,
  query: FindOptionsWhere<Entity>,
  orderOptions: FindOptionsOrder<Entity>,
  pageOptions: PageOptionsDto,
): Promise<PageDto<Entity>> {
  const [data, count] = await repository.findAndCount({
    where: query,
    order: orderOptions,
    skip: pageOptions.skip,
    take: pageOptions.take,
  });
  const meta = new PageMetaDto(pageOptions, count);
  const response = new PageDto<Entity>(data, meta);
  return response;
}
