class cell {
  x;
  y;
  z;
  polygon = Array();
  earth = 0;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.polygon = Array();
    this.earth = 0;
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

  //debug function
  drawCell(ctx) {
    if (this.earth == 0) {
      ctx.fillStyle = "#00FFFF";
    } else {
      ctx.fillStyle = "#FF0000";
    }
    ctx.beginPath();
    this.polygon.forEach((point, i) => {
      if (i == 0) {
        ctx.moveTo(point.xCoord, point.yCoord);
      } else {
        ctx.lineTo(point.xCoord, point.yCoord);
      }
    });
    ctx.closePath();
    ctx.fill();
  }
}
