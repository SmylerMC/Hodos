/**
 * A convex polygon and its barycenter.
 */
class Cell {
  #center;
  #ring = Array();
  #debugColor;
  biome;
  earth = 0;

  /**
   * Constructs a world cell.
   *
   * @param x           {Number}   the X coordinate of the cell's centroid
   * @param y           {Number}   the Y coordinate of the cell's centroid
   * @param z           {Number}   the altitude of the cell's centroid
   * @param debugColor  {GlColor} the color to draw this cell with when in debug mode
   */
  constructor(x, y, z, debugColor) {
    this.#center = new Point(x, y, z);
    this.#ring = Array();
    this.#debugColor = debugColor
      ? debugColor
      : new GlColor(Math.random(), Math.random(), Math.random());
    this.continentNumber = 0;
    this.earth = 0;
    this.biome = BIOMES["ocean"];
  }

  get ring() {
    return this.#ring;
  }

  set z(value) {
    this.#center.z = value;
  }

  get center() {
    return this.#center;
  }

  get debugColor() {
    return this.#debugColor;
  }

  addPolygonPoint(point) {
    this.#ring.push(point);
  }

  removePolygonPoint() {
    return this.#ring.pop();
  }

  setContinent(nb) {
    this.continentNumber = nb;
  }

  setEarth() {
    this.biome = BIOMES["continent"];
    //Temporary
    //TODO Actually generate an altitude value, in the MapGenerator class
    this.center.z = 0.1;
  }

  isContinent() {
    return this.biome.isContinent();
  }

  isMaritime() {
    return this.biome.isMaritime();
  }

  getListOfLongitudeBiomesProbability() {
    let longitudeBiomesProbability = {};
    /*Value between 0 and 1 telling how North is a cell*/
    let longitudeRatio = this.#center.x / WORLD_SIZE;
    for (const biome in BIOMES) {
      let μ = BIOMES[biome].longitudeAverage;
      let σ = BIOMES[biome].longitudeSigma;
      longitudeBiomesProbability[biome] = normalFunction(longitudeRatio*100, μ, σ);
    }
    return longitudeBiomesProbability;
  }

  set debugColor(value) {
    this.#debugColor = value;
  }
}

/**
 * A 3D point object.
 */
class Point {
  #x;
  #y;
  #z;

  /**
   *
   * @param {Number} x x coordinate of the point
   * @param {Number} y y coordinate of the point
   * @param {Number} z z coordinate of the point
   */
  constructor(x, y, z) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    this.#y = value;
  }

  get z() {
    return this.#z;
  }

  set z(value) {
    this.#z = value;
  }

  get coordinates() {
    return [this.#x, this.#y, this.#z];
  }
}

/**
 * A color as used in WebGL.
 * The coordinate space is normalized rgb (each color value is between 0 and 1).
 */
class GlColor {
  #red;
  #green;
  #blue;

  constructor(r, g, b) {
    this.#red = r;
    this.#green = g;
    this.#blue = b;
  }

  get red() {
    return this.#red;
  }

  get green() {
    return this.#green;
  }

  get blue() {
    return this.#blue;
  }

  get components() {
    return [this.red, this.green, this.blue];
  }
}
