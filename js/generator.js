class MapGenerator {
  seed; // String (int converted to str)
  trianglesVertices; // Array [ [x0, y0], [x1, y1], ... ]
  delaunay; // d3-delaunay object

  constructor() {
    let time = Date.now();
    this.cells = Array();
    this.seedCells = Array();
    this.seed = generateSeed();
    this.trianglesVertices = getRandomPointsIn2dRange(1000, 0, WORLD_SIZE);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.trianglesVertices = getRandomPointsIn2dRange(1000, 0, WORLD_SIZE);
    this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    this.lloydRelaxation(2);
    this.createAllCells(this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]));
    this.generateMultipleContinentBurn(15, 0.4);
    this.generateIsland(0.01);
    this.generateAltitude();
    time = Date.now() - time;
    console.log("Map generates in " + time + " ms");
  }

  // create cell from the voronoid diagram
  createAllCells(voronoid) {
    this.cells = Array();
    //all previous created point are temporary store here
    let createdPoint = new Map();
    //For every cell in Delaunay Graph create a Cell
    for (let i = 0; i < this.delaunay.points.length; i += 2) {
      this.cells.push(
        new Cell(this.delaunay.points[i], this.delaunay.points[i + 1], -1, new GlColor(0, 0, 1))
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
        //increment the number of use of the point
        createdPoint.get(Element.toString()).incrementUse();
      });
      this.cells[i / 2].removePolygonPoint();
      //this.cells[i / 2].createPolygonFromDelaunay(voronoid.cellPolygon(i / 2));
    }
  }

  /**
   * Generates a tile so it can later be rendered.
   *
   * @param {Number} z the zoom level of the tile as an integer
   * @param {Number} x the x coordinate of the tile in the corresponding zoom level grid as an integer
   * @param {Number} y the y coordinate of the tile in the corresponding zoom level grid as an integer
   */
  generateTile(z, x, y) {
    //TODO create path
    return new Tile(z, x, y, this.cells, []);
  }

  regenerate() {
    //On regénère une triangulation de delaunay a partir de 1000 points random
    this.delaunay = d3.Delaunay.from(getRandomPointsIn2dRange(1000, 0, WORLD_SIZE));
  }

  /* Lloyd's relaxation of voronoi cells */
  /* 1 or 2 steps are doing the job quite right */
  lloydRelaxation(totalSteps) {
    for (let i = 0; i < totalSteps; i++) {
      var polygons = Array.from(
          this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]).cellPolygons()
        );
      this.trianglesVertices = polygons.map(d3.polygonCentroid);
      this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    }

    console.log("Lloyd's relaxation done in " + totalSteps + " steps !");
  }

  /* GENERATION METHOD */

  generateContinentBurn() {
    let burn;
    burn = Array();
    this.seedCells.push(this.delaunay.find(WORLD_SIZE / 2, WORLD_SIZE / 2));
    burn.push(this.seedCells[0]);
    let proba = 1.0;
    while (burn.length !== 0) {
      let currentCell = burn.pop();
      if (this.cells[currentCell].earth === 0) {
        this.cells[currentCell].setEarth();
        this.cells[currentCell].debugColor = new GlColor(0, 1, 0);
        for (let next of this.delaunay.neighbors(currentCell)) {
          if (Math.random() < proba && !this.delaunay.hull.includes(next))
            burn.unshift(next);
        }
      }
      proba -= 0.01;
    }
  }

  generateMultipleContinentBurn(continentNumber, taux) {
    let burn;
    burn = Array();
    // select i cell to be the seed of continent
    for (let i = 0; i < continentNumber; i++) {
      let cellIndex = this.delaunay.find(
        getRandomInRange(0, WORLD_SIZE),
        getRandomInRange(0, WORLD_SIZE)
      );
      this.cells[cellIndex].setContinent(i + 1);
      this.seedCells.push(cellIndex);
      burn.push(cellIndex);
    }
    burn.unshift(-1);
    let proba = 1.0;
    // for every cell that can be earth
    while (burn.length > 0) {
      let cellIndex = burn.pop();
      //check if one cycle is do
      if (cellIndex === -1) {
        proba -= taux;
        if (burn.length !== 0) {
          burn.unshift(-1);
        }
      } else {
        this.cells[cellIndex].setEarth();
        this.cells[cellIndex].debugColor = new GlColor(0, 1, 0);
        for (let next of this.delaunay.neighbors(cellIndex)) {
          if (Math.random() < proba && this.cells[next].earth === 0) {
            burn.unshift(next);
            this.cells[next].setContinent(
              this.cells[cellIndex].continentNumber
            );
          }
        }
      }
    }
  }

  generateIsland(taux) {
    this.cells.forEach((cell) => {
      if (Math.random() < taux && cell.earth === 0) {
        cell.setEarth();
        cell.debugColor = new GlColor(1, 0, 0);
      }
    });
  }

  /* Generate altitude V1*/
  generateAltitude() {
    noise.seed(this.seed);
    this.cells.forEach((cell) => {
      if (cell.earth === 1) {
        // + 1) / 2 is for the output is between 0 and 1
        cell.z = (noise.simplex2(cell.center.x, cell.center.y) + 1) / 2;
        cell.ring.forEach((point) => {
          point.z = (noise.simplex2(point.x, point.y) + 1) / 2;
        });
      } else {
        cell.ring.forEach((point) => {
          point.z = -0.1;
        });
      }
    });
  }
}

/* Generate a seed for the session */
const generateSeed = () => {
  // Check URL for GET parameter "seed"
  const url = new URL(window.location.href);
  const urlSeed = url.searchParams.get("seed");

  // If seed in GET parameter, then use it...
  if (urlSeed) seed = urlSeed;
  // If not, generate it.
  else seed = Math.floor(Math.random() * 1e9).toString();

  Math.random = aleaPRNG(seed);

  return seed;
};