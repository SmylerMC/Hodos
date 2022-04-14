class MapGenerator {
  seed; // String (int converted to str)
  trianglesVertices; // Array [ [x0, y0], [x1, y1], ... ]
  delaunay; // d3-delaunay object

  constructor() {
    this.cells = Array();
    this.seed = generateSeed();
    this.trianglesVertices = fillWithPoints(1000, this);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.trianglesVertices = fillWithPoints(1000, this);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.lloydRelaxation(2);
    this.createAllCells(this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]));
    this.generateContinentBurn();
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
    return new Tile(z, x, y, this.cells, []);
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
          this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]).cellPolygons()
        ),
        centroids = polygons.map(d3.polygonCentroid);

      this.trianglesVertices = centroids;
      this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    }

    console.log("Lloyd's relaxation done in " + totalSteps + " steps !");
  }

  /* GENERATION METHOD */

  generateContinentBurn() {
    var burn;
    burn = Array();
    burn.push(
      this.delaunay.find(WORLD_SIZE / 2, WORLD_SIZE / 2)
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
        getRandomInRange(0, WORLD_SIZE),
        getRandomInRange(0, WORLD_SIZE)
      );
      this.cells[indiceCell].setContinent(i + 1);
      burn.push(indiceCell);
    }
    burn.unshift(-1);
    let proba = 1.0;
    while (burn.length != 0) {
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

}
