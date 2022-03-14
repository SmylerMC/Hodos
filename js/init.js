const worldMap = new WorldMap(document.getElementById("map"));
resize();
window.addEventListener("resize", resize);

console.log(worldMap.cells);

console.log(
  worldMap.delaunay.find(worldMap.cells[45].getX(), worldMap.cells[45].getY())
);
