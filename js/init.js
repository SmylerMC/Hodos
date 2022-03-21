const resize = () => {
	worldMap.resize(window.innerWidth, window.innerHeight);
	worldMap.camera.updateGl();
}

const worldMap = new WorldMap(document.getElementById("map"));
window.addEventListener('resize', resize)

worldMap.load().then(() => {
	resize();
	console.log("Map loaded");
	worldMap.startRender();
});
