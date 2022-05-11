const resize = () => {
  worldMap.resize(window.innerWidth, window.innerHeight);
};

const getRandomInRange = (min, max, randomFunction) => {
  return randomFunction() * (max - min) + min;
};

/**
 * Creates an array of two-dimensional arrays of numbers between lowerBound and upperBound.
 *
 * @param {Number} n            the number of points to create
 * @param {Number} lowerBound   the lower bound for the points coordinates (inclusive)
 * @param {Number} upperBound   the upper bound for the points coordinates (exclusive)
 * @returns {*[]}               the array of random 2d points, as an array of arrays
 */
const getRandomPointsIn2dRange = (n, lowerBound, upperBound, randomFunction) => {
  let arrayOfPoints = [];
  while (arrayOfPoints.length < n) {
    let x = getRandomInRange(lowerBound, upperBound, randomFunction);
    let y = getRandomInRange(lowerBound, upperBound, randomFunction);
    arrayOfPoints.push([x, y]);
  }
  return arrayOfPoints;
}

/**
 * Retrieves the "seed" GET parameter.
 *
 * @returns {string}  the "seed" GET parameter, or null if not set
 */
const getSeedFromURL = () => {
  let url = new URL(window.location.href);
  return url.searchParams.get("seed");
}

/**
 * Generates a random seed to use for map generation.
 *
 * @returns {string}  the string representation of an integer in the range [0, 1e9)
 */
const getRandomSeed = () => {
  return Math.floor(Math.random() * 1e9).toString();
}

/**
 * Mathematical function that is multiplied to the probability that a cell is burnt when creating continent.
 * 
 * @param {Number} x   the distance of the current cell from the center of the map
 * @param {Number} T   the size of the map [ex : min(height, width)] 
 * @returns {Number}   a value between 0 (when the cell is on the edge) and 1 (when the cell is in the middle)
 */
const sigma = (x, T) => {
  //let λ = 100/T;
  //TODO : Find a better function for lamda
  let λ = 0.001;
  let exp = Math.exp(-λ*(x-T/2));
  return Math.max(-2/(1+exp) + 1, 0);
}

/**
 * Function to calculate Taxi Cab distance between to points
 *
 * @param {Number} x1  x coordinate of first point
 * @param {Number} y1  y coordinate of first point
 * @param {Number} x2  x coordinate of second point
 * @param {Number} y2  y coordinate of second point
 * @returns {Number}   Taxi Cab distance
 */
const taxiDistance = (x1, y1, x2, y2) => {
  return Math.max(Math.abs(x1-x2), Math.abs(y1-y2));
}

class Counter {
  #value;

  constructor(initialValue) {
    this.#value = initialValue;
  }

  next() {
    return this.#value++;
  }

}