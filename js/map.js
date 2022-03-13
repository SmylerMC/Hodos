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
    //On regénère une triangulation de delaunay a partir de 1000 points random
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));

    //On vide le canvas
    this.gl.clearRect(0, 0, this.width, this.height);

    //Rendu des triangles de delaunay
    this.gl.beginPath();
    this.delaunay.render(this.gl);
    this.gl.strokeStyle = "#ccc";
    this.gl.stroke();

    //Rendu des cellules de voronoi
    this.gl.beginPath();
    this.delaunay
      .voronoi([0, 0, this.canvas.width, this.canvas.height])
      .render(this.gl);
    this.gl.strokeStyle = "black";
    this.gl.stroke();

    //Rendu des barycentres des voronoi
    this.gl.beginPath();
    this.delaunay.renderPoints(this.gl);
    this.gl.fillStyle = "black";
    this.gl.fill();
  }
}
