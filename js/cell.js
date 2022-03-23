class cell {
  x;
  y;
  z;
  center;
  polygon = Array();

  earth = 0;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getCoord() {
    return [this.x, this.y];
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

  setEarth() {
    this.earth = 1;
  }
}
