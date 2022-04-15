/**
 * The size of a rendered map tile, in pixels on the screen.
 */
const TILE_PIXEL_SIZE = 256;

/**
 * The maximum world coordinates in the 0/0/0 tile.
 */
const WORLD_SIZE = 10_000;

/**
 * The main map object
 */
const worldMap = new WorldMap(document.getElementById("map"));

window.addEventListener('resize', resize)

worldMap.load().then(() => {
  resize();
  console.log("Map loaded");
  worldMap.startRender();
});
