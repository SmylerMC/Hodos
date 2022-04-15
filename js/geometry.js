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

  get center() {
    return this.#center;
  }

  getPolyCoord() {
    let poly = [];
    //TODO pb de consitance
    this.#ring.forEach((point) => {
      let arr = point.coordinates;
      arr[2] = this.center.z;
      poly.push(arr);
    });
    return poly;
  }

  createPolygonFromDelaunay(points) {
    points.forEach((Element) => {
      //TODO This is broken and needs to be moved outside of here
      this.addPolygonPoint(new Point(Element[0], Element[1]));
    });
    this.#ring.pop();
  }

  addPolygonPoint(point) {
    this.#ring.push(point);
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

}

