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
    worldMap.controller.zoom(0.4);
  } else {
    worldMap.controller.zoom(-0.4);
  }
})

/*Toggle debug mode*/
document.getElementById("debug-toggle").addEventListener('change', (e) => {
  worldMap.controller.toggleDebug();
});

/*Modal pop-up*/
const toggleModal = (id) => {
  let modal = document.getElementById(id);
  if (modal.style.display == "none") {
    $("#"+id).fadeIn(200);
    modal.style.transform = "translateY(0px)";
  } else {
    $("#"+id).fadeOut(200);
    modal.style.transform = "translateY(80px)";
  }
}

document.getElementById("settings-modal-close").addEventListener('click', (e) => {
  toggleModal("settings-modal");
});

document.getElementById("settings-modal-open").addEventListener('click', (e) => {
  toggleModal("settings-modal");
});