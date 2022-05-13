/*Link between interface and worldmap*/

/*Zoom on button click*/
document.getElementById("map-zoom-in-button").addEventListener('click', (e) => {
  worldMap.controller.zoom(1);
})

document.getElementById("map-zoom-out-button").addEventListener('click', (e) => {
  worldMap.controller.zoom(-1);
})

/*Zoom on mouse wheel*/
document.getElementById("map").addEventListener('wheel', (e) => {
  e.preventDefault;
  console.log("Mouse");
  if (e.deltaY < 0) {
    worldMap.controller.zoom(1);
  } else {
    worldMap.controller.zoom(-1);
  }
})

/*Toggle debug mode*/
document.getElementById("debug-toggle").addEventListener('change', (e) => {
  worldMap.controller.toggleDebug();
});