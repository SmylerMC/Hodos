const worldMap = new WorldMap(document.getElementById("map"));
resize();
window.addEventListener("resize", resize);
console.log(worldMap.delaunay.hull);
