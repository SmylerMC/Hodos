const resize = () => {
	worldMap.resize(window.innerWidth, window.innerHeight);
}

const worldMap = new WorldMap(document.getElementById("map"));
resize();
window.addEventListener('resize', resize)

worldMap.load().then(() => {
	console.log("Map loaded");
	worldMap.startRender();
});
