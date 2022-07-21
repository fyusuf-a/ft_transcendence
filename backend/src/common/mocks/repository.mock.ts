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
  findOneBy = jest.fn((query: { id: number }): undefined | T => {
    return this.#entities[query.id];
  });
  findOneByOrFail = jest.fn((query: { id: number }): undefined | T => {
    return this.#entities[query.id];
  });
  find = jest.fn((): T[] => this.#entities.filter((x) => x !== undefined));
  findAndCount = jest.fn((): [T[], number] => {
    const returnEntities = this.find();
    return [returnEntities, returnEntities.length];
  });
  findBy = this.find;
  findAll = this.find;
  findAllBy = this.find;
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
}
