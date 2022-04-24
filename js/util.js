const resize = () => {
  worldMap.resize(window.innerWidth, window.innerHeight);
};

const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Creates an array of two-dimensional arrays of numbers between lowerBound and upperBound.
 *
 * @param {Number} n            the number of points to create
 * @param {Number} lowerBound   the lower bound for the points coordinates (inclusive)
 * @param {Number} upperBound   the upper bound for the points coordinates (exclusive)
 * @returns {*[]}               the array of random 2d points, as an array of arrays
 */
const getRandomPointsIn2dRange = (n, lowerBound, upperBound) => {
  let arrayOfPoints = [];
  while (arrayOfPoints.length < n) {
    let x = getRandomInRange(lowerBound, upperBound);
    let y = getRandomInRange(lowerBound, upperBound);
    arrayOfPoints.push([x, y]);
  }
  return arrayOfPoints;
}