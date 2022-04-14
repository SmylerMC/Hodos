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
