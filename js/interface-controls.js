/*Link between interface and worldmap*/

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