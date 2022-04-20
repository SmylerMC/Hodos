class MapGenerator {
  seed; // String (int converted to str)
  trianglesVertices; // Array [ [x0, y0], [x1, y1], ... ]
  delaunay; // d3-delaunay object

  constructor() {
    this.cells = Array();
    this.seedCells = Array();
    this.seed = generateSeed();
    this.trianglesVertices = fillWithPoints(1000, this);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.trianglesVertices = fillWithPoints(1000, this);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.lloydRelaxation(2);
    this.createAllCells(this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]));
    this.generateMultipleContinentBurn(1, 0.2);
    this.generateIsland(0.01);
    this.generateAltitude();
  }

  // create cell from the voronoid diagram
  createAllCells(voronoid) {
    this.cells = Array();
    //all previous created point are temporary store here
    let createdPoint = new Map();
    //For evrey cell in Delaunay Graph create a Cell
    for (let i = 0; i < this.delaunay.points.length; i += 2) {
      this.cells.push(
        new Cell(this.delaunay.points[i], this.delaunay.points[i + 1], -1)
      );
      //Create an arrays with the point of the polygon
      voronoid.cellPolygon(i / 2).forEach((Element) => {
        if (!createdPoint.has(Element.toString())) {
          createdPoint.set(
            Element.toString(),
            new Point(Element[0], Element[1], -1) // -1 is for point is sea y default
          );
        }
        this.cells[i / 2].addPolygonPoint(createdPoint.get(Element.toString()));
        //increment the numer of use of the point
        createdPoint.get(Element.toString()).incrementUse();
      });
      this.cells[i / 2].removePolygonPoint();
      //this.cells[i / 2].createPolygonFromDelaunay(voronoid.cellPolygon(i / 2));
    }
  }

  /**
   * Generates a tile so it can later be rendered.
   *
   * @param {int} z the zoom level of the tile
   * @param {int} x the x coordinate of the tile in the corresponding zoom level grid
   * @param {int} y the y coordinate of the tile in the corresponding zoom level grid
   */
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
    this.seedCells.push(this.delaunay.find(WORLD_SIZE / 2, WORLD_SIZE / 2));
    burn.push(this.seedCells[0]);
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
      this.seedCells.push(indiceCell);
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

  /* Generate altitude V1*/
  generateAltitude() {
    noise.seed(this.seed);
    var altitude;
    this.cells.forEach((cell) => {
      if (cell.earth == 1) {
        // + 1) / 2 is for the ouput is between 0 and 1
        cell.setZ((noise.perlin2(cell.x, cell.y) + 1) / 2);
        cell.ring.forEach((point) => {
          point.z = (noise.perlin2(point.x, point.y) + 1) / 2;
        });
      }
      console.log(cell);
    });
  }
}

/* Generate a seed for the session */
const generateSeed = () => {
  // Check URL for GET parameter "seed"
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const urlSeed = url.searchParams.get("seed");

  // If seed in GET parameter, then use it...
  if (urlSeed) seed = urlSeed;
  // If not, generate it.
  else seed = Math.floor(Math.random() * 1e9).toString();

  Math.random = aleaPRNG(seed);

  return seed;
};

/* Generate n points on a WorldMap surface */
const fillWithPoints = (n, worldMap) => {
  let arrayOfPoints = [];
  for (let i = 0; i < n; i++) {
    let x = getRandomInRange(0, WORLD_SIZE);
    let y = getRandomInRange(0, WORLD_SIZE);
    arrayOfPoints.push([x, y]);
  }
  return arrayOfPoints;
};
