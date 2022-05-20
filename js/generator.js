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
    let trianglesVertices = getRandomPointsIn2dRange(
      10000,
      0,
      WORLD_SIZE,
      this.#random
    );
    this.delaunay = d3.Delaunay.from(trianglesVertices);
    trianglesVertices = getRandomPointsIn2dRange(
      10000,
      0,
      WORLD_SIZE,
      this.#random
    );
    this.delaunay = d3.Delaunay.from(trianglesVertices);
    this.lloydRelaxation(2);
    this.cells = this.createAllCells(
      this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE])
    );
    this.generateMultipleContinentBurn(15, 0.1);
    this.generateIsland(0.01, 0.4);
    this.generateAltitude();
    this.generateBiome();
    this.generateCorruptedBurn();

    this.colorizeBiome();
    time = Date.now() - time;
    console.log("Map generates in " + time + " ms");
    return new Tile(z, x, y, this.cells);
  }

  // create cell from the voronoid diagram
  createAllCells(voronoid) {
    let cells = Array();
    // All previously created point are temporary store here
    let createdPoint = new Map();
    // For every cell in Delaunay Graph create a Cell
    for (let i = 0; i < this.delaunay.points.length; i += 2) {
      cells.push(
        new Cell(
          this.delaunay.points[i],
          this.delaunay.points[i + 1],
          -1,
          new GlColor(0, 0, 1)
        )
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
      let polygons = Array.from(
        this.delaunay.voronoi([0, 0, WORLD_SIZE, WORLD_SIZE]).cellPolygons()
      );
      this.trianglesVertices = polygons.map(d3.polygonCentroid);
      this.delaunay = d3.Delaunay.from(this.trianglesVertices);
    }

    console.log("Lloyd's relaxation done in " + totalSteps + " steps !");
  }

  /* GENERATION METHOD */

  generateMultipleContinentBurn(numberOfContinent, rate) {
    let burn = Array();
    const MAP_SIZE_PERCENT_MARGIN = 0.1;
    // select i cell to be the seed of continent
    for (let i = 0; i < numberOfContinent; i++) {
      let cellIndex = this.delaunay.find(
        getRandomInRange(
          WORLD_SIZE * MAP_SIZE_PERCENT_MARGIN,
          WORLD_SIZE * (1 - MAP_SIZE_PERCENT_MARGIN),
          this.#random
        ),
        getRandomInRange(
          WORLD_SIZE * MAP_SIZE_PERCENT_MARGIN,
          WORLD_SIZE * (1 - MAP_SIZE_PERCENT_MARGIN),
          this.#random
        )
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
        proba -= rate;
        if (burn.length !== 0) {
          burn.unshift(-1);
        }
      } else {
        this.cells[cellIndex].setEarth();
        this.cells[cellIndex].debugColor = new GlColor(0, 1, 0);
        for (let next of this.delaunay.neighbors(cellIndex)) {
          let distanceFromCenter = taxiDistance(
            this.cells[next].center.x,
            this.cells[next].center.y,
            WORLD_SIZE / 2,
            WORLD_SIZE / 2
          );
          if (
            this.#random() < proba * sigma(distanceFromCenter, WORLD_SIZE) &&
            this.cells[next].earth === 0
          ) {
            burn.unshift(next);
            this.cells[next].setContinent(
              this.cells[cellIndex].continentNumber
            );
          }
        }
      }
    }
  }

  generateIsland(rate, fairyRate) {
    this.cells.forEach((cell) => {
      if (this.#random() < rate && cell.isMaritime()) {
        let distanceFromCenter = taxiDistance(
          cell.center.x,
          cell.center.y,
          WORLD_SIZE / 2,
          WORLD_SIZE / 2
        );
        if (distanceFromCenter < (WORLD_SIZE * 0.95) / 2) {
          if (this.#random() < fairyRate) {
            cell.biome = BIOMES["Fairy"];
          } else {
            cell.biome = BIOMES["island"];
            cell.debugColor = new GlColor(0, 0, 0);
          }
        }
      }
    });
  }

  /* Generate altitude V1*/
  generateAltitude() {
    const frequency = (1 / WORLD_SIZE) * 15;
    noise.seed(this.#seed);
    this.cells.forEach((cell) => {
      if (cell.isContinent()) {
        // + 1) / 2 is for the output is between 0 and 1
        cell.center.z =
          (noise.simplex2(
            cell.center.x * frequency,
            cell.center.y * frequency
          ) +
            1) /
          2;
        cell.ring.forEach((point) => {
          point.z =
            (noise.simplex2(point.x * frequency, point.y * frequency) + 1) / 2;
        });
      } else {
        cell.center.z = -0.1;
        cell.ring.forEach((point) => {
          point.z = -0.1;
        });
      }
    });
  }

  get seed() {
    return this.#seed;
  }

  get random() {
    return this.#random;
  }

  /* Biome générator V1*/
  generateBiome() {
    let burn = Array();
    this.seedCells.forEach((nbCell) => {
      let nextBiome = this.cells[nbCell].getBiomeType(this.#random);
      this.cells[nbCell].biome =
        BIOMES[BIOMESPOOL[nextBiome].at(getRandomInRange(0, 1, this.#random))];
      if (this.cells[nbCell].z > 0.8) {
        this.cells[nbCell].biome = BIOMES["Mountain"];
      }
      burn.push(nbCell);
    });
    while (burn.length > 0) {
      let current = burn.pop();

      for (let next of this.delaunay.neighbors(current)) {
        if (
          this.cells[next].isContinent() &&
          this.cells[next].getBiomePool() === "default"
        ) {
          if (this.cells[next].center.z > 0.8) {
            this.cells[next].biome = BIOMES["Mountain"];
          } else {
            //Magnifique repartiteur de biome
            let nextBiome = this.cells[next].getBiomeType(this.#random);
            if (this.cells[current].getBiomePool() === nextBiome) {
              this.cells[next].biome = BIOMES[this.cells[current].biome.stay()];
            } else {
              this.cells[next].biome =
                BIOMES[
                  BIOMESPOOL[nextBiome].at(getRandomInRange(0, 1, this.#random))
                ];
            }
          }
          burn.unshift(next);
        }
      }
    }
  }

  generateCorruptedBurn() {
    let burn;
    burn = Array();
    let x = Math.ceil(
      getRandomInRange(0, this.seedCells.length - 1, this.#random)
    );
    burn.push(this.seedCells[x]);
    let proba = 1.0;
    while (burn.length !== 0) {
      let currentCell = burn.pop();
      if (this.cells[currentCell].isContinent()) {
        this.cells[currentCell].biome = BIOMES["Corrupted"];
        for (let next of this.delaunay.neighbors(currentCell)) {
          if (this.#random() < proba && this.cells[next].isContinent())
            burn.push(next);
          proba -= 0.2;
        }
      }
    }
  }

  /* truc moche*/
  colorizeBiome() {
    this.cells.forEach((cell) => {
      if (cell.biome === BIOMES["Taiga"]) {
        cell.debugColor = new GlColor(1, 1, 1);
      }
      if (cell.biome === BIOMES["Tundra"]) {
        cell.debugColor = new GlColor(0.8, 0.8, 0.8);
      }
      if (cell.biome === BIOMES["Forest"]) {
        cell.debugColor = new GlColor(0, 1, 0);
      }
      if (cell.biome === BIOMES["Plain"]) {
        cell.debugColor = new GlColor(0, 0.8, 0);
      }
      if (cell.biome === BIOMES["Swamp"]) {
        cell.debugColor = new GlColor(0, 1, 1);
      }
      if (cell.biome === BIOMES["Jungle"]) {
        cell.debugColor = new GlColor(0, 0.8, 0.8);
      }
      if (cell.biome === BIOMES["Desert"]) {
        cell.debugColor = new GlColor(1, 0, 0);
      }
      if (cell.biome === BIOMES["Savana"]) {
        cell.debugColor = new GlColor(0.8, 0, 0);
      }
      if (cell.biome === BIOMES["Mountain"]) {
        cell.debugColor = new GlColor(0.5, 0.5, 0.5);
      }
      if (cell.biome === BIOMES["Corrupted"]) {
        cell.debugColor = new GlColor(0.5, 0, 1);
      }
      if (cell.biome === BIOMES["Fairy"]) {
        cell.debugColor = new GlColor(1, 0.75, 0.8);
      }
    });
  }
}
