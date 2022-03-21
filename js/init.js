/**
 * The size of a rendered map tile, in pixels on the screen.
 */
const SCALE = 256;


const resize = () => {
	worldMap.resize(window.innerWidth, window.innerHeight);
}

const worldMap = new WorldMap(document.getElementById("map"));
window.addEventListener('resize', resize)

worldMap.load().then(() => {
	resize();
	console.log("Map loaded");
	worldMap.startRender();
});
