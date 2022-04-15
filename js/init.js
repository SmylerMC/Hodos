window.addEventListener('resize', resize)

/**
 * The main map object
 */
const worldMap = new WorldMap(document.getElementById("map"));

worldMap.load().then(() => {
  resize();
  console.log("Map loaded");
  worldMap.startRender();
});
