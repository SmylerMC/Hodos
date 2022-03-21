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
