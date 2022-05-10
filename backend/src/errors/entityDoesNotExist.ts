export class EntityDoesNotExistError extends Error {
  constructor(msg: string) {
    super(msg + " does not exist");
  }
}
