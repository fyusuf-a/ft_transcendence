import { PageDto, PageOptionsDto } from '@dtos/pages';
import { FindManyOptions, FindOptionsOrder } from 'typeorm';
import { paginate } from './paginate';

class MockEntity {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

describe('paginate', () => {
  it('should return a PageDto', async () => {
    const repository = {
      findAndCount(options?: FindManyOptions): Promise<[MockEntity[], number]> {
        let data = [];
        if (options) data = [new MockEntity(1), new MockEntity(2)];
        return Promise.resolve([data, data.length]);
      },
    };
    const query = { id: 1 };
    const orderOptions: FindOptionsOrder<MockEntity> = {};
    const pageOptions: PageOptionsDto = { skip: 0 };
    const response = await paginate(
      repository,
      query,
      orderOptions,
      pageOptions,
    );
    expect(response).toBeInstanceOf(PageDto);
    expect(response.data.length).toBe(2);
    expect(response.meta.itemCount).toBe(2);
    expect(response.data[0].id).toEqual(1);
    expect(response.data[1].id).toEqual(2);
  });
});
