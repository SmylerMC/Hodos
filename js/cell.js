class cell {
  #x;
  #y;
  #z;
  polygon = Array();
  earth = 0;

  constructor(x, y, z) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
    this.polygon = Array();

    this.continentNumber = 0;
    this.earth = 0;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get z() {
    return this.#z;
  }

  getCoord() {
    return [this.x, this.y, this.z];
  }

  getPolyCoord() {
    let poly = [];
    //TODO pb de consitance
    this.polygon.forEach((point) => {
      let arr = point.getCoord();
      arr[2] = this.z;
      poly.push(arr);
    });
    return poly;
  }

  createPolygonFromDelaunay(points) {
    points.forEach((Element) => {
      this.addPolygonPoint(new point(Element[0], Element[1]));
    });
    this.polygon.pop();
  }

  addPolygonPoint(point) {
    this.polygon.push(point);
  }

  setContinent(nb) {
    this.continentNumber = nb;
  }

  setEarth() {
    this.earth = 1;
    //Temporary
    this.#z = 0.1;
  }

}
