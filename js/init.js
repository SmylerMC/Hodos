/**
 * The size of a rendered map tile, in pixels on the screen.
 */
const TILE_PIXEL_SIZE = 256;

const worldMap = new WorldMap(document.getElementById("map"));

window.addEventListener('resize', resize)

worldMap.load().then(() => {
	resize();
	console.log("Map loaded");
	worldMap.startRender();
});
