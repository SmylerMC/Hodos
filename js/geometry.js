/**
 * A convex polygon and its barycenter.
 */
class Cell {
  #center;
  #ring = Array();
  earth = 0;

  constructor(x, y, z) {
    this.#center = new Point(x, y, z);
    this.#ring = Array();

    this.continentNumber = 0;
    this.earth = 0;
  }

  get x() {
    return this.#center.x;
  }

  get y() {
    return this.#center.y;
  }

  get z() {
    return this.#center.z;
  }

  get ring() {
    return this.#ring;
  }

  set z(value) {
    this.#center.z = value;
  }

  get center() {
    return this.#center;
  }

  getPolyCoord() {
    let poly = [];
    //TODO pb de consitance
    this.#ring.forEach((point) => {
      let arr = point.coordinates;
      poly.push(arr);
    });
    return poly;
  }

  createPolygonFromDelaunay(points) {
    points.forEach((Element) => {
      //TODO This is broken and needs to be moved outside of here
      this.addPolygonPoint(new Point(Element[0], Element[1], 0));
    });
    this.#ring.pop();
  }

  addPolygonPoint(point) {
    this.#ring.push(point);
  }

  removePolygonPoint() {
    return this.#ring.pop();
  }

  setContinent(nb) {
    this.continentNumber = nb;
  }

  setEarth() {
    this.earth = 1;
    //Temporary
    //TODO Actually generate an altitude value, in the MapGenerator class
    this.center.z = 0.1;
  }
}

/**
 * A 3D point object.
 */
class Point {
  #x;
  #y;
  #z;
  #nbUse;

  /**
   *
   * @param {float} x x coordinate of the point
   * @param {float} y y coordinate of the point
   * @param {float} z z coordinate of the point
   */
  constructor(x, y, z) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
    this.#nbUse = 0;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    this.#y = value;
  }

  get z() {
    return this.#z;
  }

  set z(value) {
    this.#z = value;
  }

  get coordinates() {
    return [this.#x, this.#y, this.#z];
  }

  get nbUse() {
    return this.#nbUse;
  }

  incrementUse() {
    this.#nbUse += 1;
  }
}
