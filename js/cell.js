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

  setContinent(nb) {
    this.continentNumber = nb;
  }

  setEarth() {
    this.earth = 1;
    //Temporary
    this.#z = 1;
  }

  //debug function
  drawCell(ctx) {
    if (this.earth == 0) {
      ctx.fillStyle = "#00FFFF";
    } else {
      ctx.fillStyle =
        "#FF" +
        this.continentNumber.toString(16) +
        "0" +
        this.continentNumber.toString(16) +
        "0";
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
