class WorldMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext("2d");
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));
    this.cells = Array();
  }

  createAllCells(voronoid) {
    this.cells = Array();
    for (let i = 0; i < this.delaunay.points.length; i += 2) {
      this.cells.push(
        new cell(this.delaunay.points[i], this.delaunay.points[i + 1], 0)
      );
      this.cells[i / 2].createPolygonFromDelaunay(voronoid.cellPolygon(i / 2));
    }
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.regenerate();
    this.createAllCells(this.delaunay.voronoi([0, 0, width, height]));
    //this.render();
    this.generateContinent();
    this.renderCell();
  }

  regenerate() {
    //On regénère une triangulation de delaunay a partir de 1000 points random
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));
  }

  render() {
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

  renderCell() {
    this.cells.forEach((cell) => {
      if (cell.earth == 0) this.gl.fillStyle = "#00FFFF";
      else this.gl.fillStyle = "#FF0000";
      this.gl.fillRect(cell.getX(), cell.getY(), 2, 2);
    });
  }

  generateContinent() {
    var burn;
    burn = Array();
    burn.push(
      this.delaunay.find(window.innerWidth / 2, window.innerHeight / 2)
    );
    let proba = 1.0;
    while (burn.length != 0) {
      var current_cell = burn.pop();
      if (this.cells[current_cell].earth == 0) {
        this.cells[current_cell].setEarth();
        for (let next of this.delaunay.neighbors(current_cell)) {
          if (Math.random() < proba) burn.push(next);
        }
      }
      proba -= 0.05;
    }
  }
}
