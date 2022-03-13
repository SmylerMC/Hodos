class WorldMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext("2d");
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }

  render() {
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));
    this.gl.clearRect(0, 0, this.width, this.height);
    this.gl.fillStyle = "black";
    this.gl.beginPath();
    this.delaunay.render(this.gl, 1);
    this.gl.stroke();
  }
}
