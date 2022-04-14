class point {
  #xCoord;
  #yCoord;
  #altitude;

  /**
   *
   * @param {float} x x coordinate of the point
   * @param {float} y y coordinate of the point
   * @param {float} z altitude of the point
   */
  constructor(x, y, z) {
    this.#xCoord = x;
    this.#yCoord = y;
    this.#altitude = z;
  }

  get xCoord() {
    return this.#xCoord;
  }

  get yCoord() {
    return this.#yCoord;
  }

  get altitude() {
    return this.#altitude;
  }

  getCoord() {
    return [this.xCoord, this.yCoord, this.altitude];
  }
}
