export class Grid {
  // the size of the playing area
  #width: number;
  #height: number;

  constructor(width: number, height: number) {
    this.#width = width;
    this.#height = height;
  }

  get height() {
    return this.#height;
  }

  get width() {
    return this.#width;
  }
}
