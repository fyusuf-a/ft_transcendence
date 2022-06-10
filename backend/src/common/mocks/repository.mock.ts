import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
/*import { Repository } from 'typeorm';

type MyMockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;*/

export class MockRepository<T> {
  constructor(private readonly entity: T, private readonly elementNumber = 2) {}
  findOne(id: number) {
    if (id > this.elementNumber) {
      return undefined;
    }
    return this.entity;
  }
  find = jest.fn(() => Array(this.elementNumber).fill(this.entity));
  save = jest.fn(() => this.entity);
  delete = jest.fn(() => new DeleteResult());
  update = jest.fn(() => new UpdateResult());

  async findAllPaginated(
    pageOptions?: PageOptionsDto,
    //alias = '',
    //orderingColumn = 'id',
    //customizer?: (a: SelectQueryBuilder<T>) => void,
  ): Promise<PageDto<T>> {
    if (!pageOptions) {
      pageOptions = new PageOptionsDto();
    }
    const entities = Array(
      this.elementNumber > pageOptions.take
        ? pageOptions.take
        : this.elementNumber,
    ).fill(this.entity);
    const pageMetaDto = new PageMetaDto(pageOptions, this.elementNumber);
    return new PageDto(entities, pageMetaDto);
  }
}
