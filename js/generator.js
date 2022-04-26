class MapGenerator {

  #seed; // String (int converted to str)
  trianglesVertices; // Array [ [x0, y0], [x1, y1], ... ]
  delaunay; // d3-delaunay object
  #random;

  constructor(seed) {
    if (seed) {
      this.#seed = seed;
    } else {
      this.#seed = getRandomSeed();
    }
    this.#random = aleaPRNG(this.#seed);
  }

  /**
   * Generates a tile so it can later be rendered.
   *
   * @param {Number} z the zoom level of the tile as an integer
   * @param {Number} x the x coordinate of the tile in the corresponding zoom level grid as an integer
   * @param {Number} y the y coordinate of the tile in the corresponding zoom level grid as an integer
   */
  generateTile(z, x, y) {
    let time = Date.now();
    this.seedCells = Array();
    let trianglesVertices = getRandomPointsIn2dRange(1000, 0, WORLD_SIZE);
    this.delaunay = d3.Delaunay.from(trianglesVertices);
    trianglesVertices = getRandomPointsIn2dRange(1000, 0, WORLD_SIZE);
    this.delaunay = d3.Delaunay.from(trianglesVertices);
    this.lloydRelaxation(2);
    let cells = this.createAllCells(this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]));
    this.generateMultipleContinentBurn(cells, 15, 0.4);
    this.generateIsland(cells, 0.01);
    this.generateAltitude(cells);
    time = Date.now() - time;
    console.log("Map generates in " + time + " ms");
    //TODO create paths
    return new Tile(z, x, y, cells, []);
  }

  // create cell from the voronoid diagram
  createAllCells(voronoid) {
    let cells = Array();
    // All previously created point are temporary store here
    let createdPoint = new Map();
    // For every cell in Delaunay Graph create a Cell
    for (let i = 0; i < this.delaunay.points.length; i += 2) {
      cells.push(
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
        cells[i / 2].addPolygonPoint(createdPoint.get(Element.toString()));
      });
      cells[i / 2].removePolygonPoint();
      //cells[i / 2].createPolygonFromDelaunay(voronoid.cellPolygon(i / 2));
    }
    return cells;
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

  generateContinentBurn(cells) {
    let burn;
    burn = Array();
    this.seedCells.push(this.delaunay.find(WORLD_SIZE / 2, WORLD_SIZE / 2));
    burn.push(this.seedCells[0]);
    let proba = 1.0;
    while (burn.length !== 0) {
      let currentCell = burn.pop();
      if (cells[currentCell].earth === 0) {
        cells[currentCell].setEarth();
        cells[currentCell].debugColor = new GlColor(0, 1, 0);
        for (let next of this.delaunay.neighbors(currentCell)) {
          if (this.#random() < proba && !this.delaunay.hull.includes(next))
            burn.unshift(next);
        }
      }
      proba -= 0.01;
    }
  }

  generateMultipleContinentBurn(cells, numberOfContinent, taux) {
    let burn = Array();
    const MAP_SIZE_PERCENT_MARGIN = 0.1;
    // select i cell to be the seed of continent
    for (let i = 0; i < numberOfContinent; i++) {
      let cellIndex = this.delaunay.find(
        getRandomInRange(WORLD_SIZE*MAP_SIZE_PERCENT_MARGIN, WORLD_SIZE*(1-MAP_SIZE_PERCENT_MARGIN)),
        getRandomInRange(WORLD_SIZE*MAP_SIZE_PERCENT_MARGIN, WORLD_SIZE*(1-MAP_SIZE_PERCENT_MARGIN))
      );
      cells[cellIndex].setContinent(i + 1);
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
        cells[cellIndex].setEarth();
        cells[cellIndex].debugColor = new GlColor(0, 1, 0);
        for (let next of this.delaunay.neighbors(cellIndex)) {
          let distanceFromCenter = taxiDistance(cells[next].center.x, cells[next].center.y, WORLD_SIZE/2, WORLD_SIZE/2);
          if (this.#random() < proba*sigma(distanceFromCenter, WORLD_SIZE) && cells[next].earth === 0) {
            burn.unshift(next);
            cells[next].setContinent(
              cells[cellIndex].continentNumber
            );
          }
        }
      }
    }
  }

  generateIsland(cells, taux) {
    cells.forEach((cell) => {
      if (this.#random() < taux && cell.earth === 0) {
        let distanceFromCenter = taxiDistance(cell.center.x, cell.center.y, WORLD_SIZE/2, WORLD_SIZE/2);
        if (distanceFromCenter < WORLD_SIZE*0.95/2) {
          cell.setEarth();
          cell.debugColor = new GlColor(1, 0, 0);
        } 
      }
    });
  }

  /* Generate altitude V1*/
  generateAltitude(cells) {
    const frequency = 1 / WORLD_SIZE * 15;
    noise.seed(this.#seed);
    cells.forEach((cell) => {
      if (cell.earth === 1) {
        // + 1) / 2 is for the output is between 0 and 1
        cell.z = (noise.simplex2(cell.center.x * frequency, cell.center.y * frequency) + 1) / 2;
        cell.ring.forEach((point) => {
          point.z = (noise.simplex2(point.x * frequency, point.y * frequency) + 1) / 2;
        });
      } else {
        cell.ring.forEach((point) => {
          point.z = -0.1;
        });
      }
    });
  }

  get seed() {
    return this.#seed;
  }

}