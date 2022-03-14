class cell {
  center;
  polygon = Array();

  earth = 0;

  constructor(x, y, z) {
    this.center = new point(x, y, z);
  }

  getX() {
    return this.center.xCoord;
  }

  getY() {
    return this.center.yCoord;
  }

  getCoord() {
    return [this.center.xCoord, this.center.yCoord];
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
}
