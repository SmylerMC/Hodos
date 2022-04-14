class MapGenerator {
  seed; // String (int converted to str)
  trianglesVertices; // Array [ [x0, y0], [x1, y1], ... ]
  delaunay; // d3-delaunay object

  constructor(canvas) {
    this.cells = Array();
    this.seed = generateSeed();
    this.trianglesVertices = fillWithPoints(1000, this);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.trianglesVertices = fillWithPoints(1000, this);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.lloydRelaxation(2);
    this.createAllCells(this.delaunay.voronoi([0, 0, SCALE, SCALE]));
    this.generateMultipleContinentBurn(10, 0.5);
    this.generateIsland(0.01);
  }

  // create cell from the voronoid diagram
  createAllCells(voronoid) {
    this.cells = Array();
    //For evrey cell in Delaunay Graph create a Cell
    for (let i = 0; i < this.delaunay.points.length; i += 2) {
      this.cells.push(
        new cell(this.delaunay.points[i], this.delaunay.points[i + 1], -1)
      );
      //Create an arrays with the point of the polygon
      this.cells[i / 2].createPolygonFromDelaunay(voronoid.cellPolygon(i / 2));
    }
  }

  //Create Tile for rendering
  generateTile(z, x, y) {
    //TODO create path
    tile = new Tile(z, x, y, this.cells, []);
    return Tile;
  }

  regenerate() {
    //On regénère une triangulation de delaunay a partir de 1000 points random
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));
  }

  /* Lloyd's relaxation of voronoi cells */
  /* 1 or 2 steps are doing the job quite right */
  lloydRelaxation(totalSteps) {
    for (let i = 0; i < totalSteps; i++) {
      var polygons = Array.from(
          this.delaunay.voronoi([0, 0, SCALE, SCALE]).cellPolygons()
        ),
        centroids = polygons.map(d3.polygonCentroid);

      this.trianglesVertices = centroids;
      this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    }

    console.log("Lloyd's relaxation done in " + totalSteps + " steps !");
  }

  /* DEV METHODS / STATIC */

  /* Colorize the edges of the i triangle */
  color(i) {
    this.gl.beginPath();
    this.delaunay.renderTriangle(i, this.gl);
    this.gl.strokeStyle = "#b8625c";
    this.gl.stroke();
  }

  /* Colorize progressively the edges of the start to end triangles */
  static colorRange(a, start, end) {
    var i = start; //  set your counter to 1

    function myLoop(a) {
      //  create a loop function
      setTimeout(function () {
        //  call a 3s setTimeout when the loop is called
        a.color(i);
        i++; //  increment the counter
        if (i < end) {
          //  if the counter < 10, call the loop function
          myLoop(a); //  ..  again which will trigger another
        } //  ..  setTimeout()
      }, 100);
    }

    myLoop(a);
  }

  colorPoints() {
    this.gl.beginPath();
    this.delaunay.renderPoints(this.gl);
    this.gl.fillStyle = "red";
    this.gl.fill();
  }

  colorPolygonAndPoint(i) {
    this.gl.beginPath();
    this.delaunay.voronoi([0, 0, SCALE, SCALE]).renderCell(i, this.gl);
    this.gl.fillStyle = "green";
    this.gl.fill();

    this.gl.beginPath();
    this.gl.fillStyle = "red";
    this.gl.fillRect(
      this.delaunay.points[i * 2],
      this.delaunay.points[i * 2 + 1],
      2,
      2
    );
  }

  /* GENERATION METHOD */

  generateContinentBurn() {
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
          if (Math.random() < proba && !this.delaunay.hull.includes(next))
            burn.unshift(next);
        }
      }
      proba -= 0.01;
    }
  }

  generateMultipleContinentBurn(continentNumber, taux) {
    var burn;
    burn = Array();
    var indiceCell;
    for (let i = 0; i < continentNumber; i++) {
      indiceCell = this.delaunay.find(
        getRandomInRange(0, window.innerWidth),
        getRandomInRange(0, window.innerHeight)
      );
      this.cells[indiceCell].setContinent(i + 1);
      burn.push(indiceCell);
    }
    burn.unshift(-1);
    let proba = 1.0;
    while (burn.length != 0) {
      console.log(burn);
      var indiceCell = burn.pop();
      if (indiceCell == -1) {
        proba -= taux;
        if (burn.length != 0) {
          burn.unshift(-1);
        }
      } else {
        this.cells[indiceCell].setEarth();
        var tempFuture = Array();
        for (let next of this.delaunay.neighbors(indiceCell)) {
          if (
            Math.random() < proba &&
            !this.delaunay.hull.includes(next) &&
            this.cells[next].earth == 0
          ) {
            burn.unshift(next);
            this.cells[next].setContinent(
              this.cells[indiceCell].continentNumber
            );
          }
        }
      }
    }
  }

  generateIsland(taux) {
    this.cells.forEach((cell) => {
      if (Math.random() < taux) {
        cell.setEarth();
      }
    });
  }

  /* RENDER DEBUG METHOD */

  render() {
    //On regénère une triangulation de delaunay a partir de 1000 points random
    //On vide le canvas
    this.gl.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
      cell.drawCell(this.gl);
    });
  }
}
