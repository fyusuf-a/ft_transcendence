import { PageDto, PageOptionsDto, PageMetaDto } from '@dtos/pages';
import { DeleteResult, UpdateResult } from 'typeorm';
/*import { Repository } from 'typeorm';

type MyMockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;*/

interface Identifiable {
  id: number;
}

export class MockRepository<T extends Identifiable> {
  #entities: T[];
  #currentId: number;
  #itemNumber: number;
  #entityFactory: () => T;

  private addEntity(entity: T) {
    this.#currentId++;
    this.#itemNumber++;
    this.#entities[this.#currentId] = entity;
    this.#entities[this.#currentId].id = this.#currentId;
  }

  constructor(entityFactory: () => T, elementNumber = 2) {
    this.#entityFactory = entityFactory;
    this.#entities = [];
    this.#currentId = 0;
    for (let i = 0; i < elementNumber; i++) {
      this.addEntity(entityFactory());
    }
  }
  findOne = jest.fn((id: number): undefined | T => {
    return this.#entities[id];
  });
  find = jest.fn((): T[] => this.#entities);
  findAll = jest.fn((): T[] => this.#entities);
  save = jest.fn((entity: T): T => {
    const newEntity = this.#entityFactory();
    Object.assign(newEntity, entity);
    this.addEntity(newEntity);
    return newEntity;
  });
  delete = jest.fn((id: number): DeleteResult => {
    delete this.#entities[id];
    return new DeleteResult();
  });

  update = jest.fn(() => new UpdateResult());

  findAllPaginated = jest.fn((pageOptions?: PageOptionsDto): PageDto<T> => {
    if (!pageOptions) {
      pageOptions = new PageOptionsDto();
    }
    let skippedEntities = 0;
    const result = [];
    for (let i = 0; i < this.#entities.length; i++) {
      if (
        this.#entities[i] != undefined &&
        skippedEntities >= pageOptions.skip
      ) {
        result.push(this.#entities[i]);
        if (result.length >= pageOptions.take) break;
      } else skippedEntities++;
    }
    const pageMetaDto = new PageMetaDto(pageOptions, this.#itemNumber);
    return new PageDto(result, pageMetaDto);
  });
}
