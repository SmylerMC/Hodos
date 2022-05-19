/*Link between interface and worldmap*/

/*Zoom on button click*/
document.getElementById("map-zoom-in-button").addEventListener('click', (e) => {
  worldMap.controller.zoom(1);
})

document.getElementById("map-zoom-out-button").addEventListener('click', (e) => {
  worldMap.controller.zoom(-1);
})

/*Move on mouse drag and drop*/
let isDragging = false;
let x = 0;
let y = 0;
const rect = document.getElementById("map").getBoundingClientRect();

document.getElementById("map").addEventListener('mousedown', (e) => {
  e.preventDefault;
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDragging = true;
})

document.getElementById("map").addEventListener('mousemove', e => {
  if (isDragging === true) {
    let amplitude = 20/(Math.abs(worldMap.camera.zoom) + 1)
    worldMap.controller.move((x-(e.clientX - rect.left))*amplitude, (-y+(e.clientY - rect.top))*amplitude);
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
});

document.getElementById("map").addEventListener('mouseup', e => {
  if (isDragging === true) {
    x = 0;
    y = 0;
    isDragging = false;
  }
});

/*Zoom on mouse wheel*/
document.getElementById("map").addEventListener('wheel', (e) => {
  e.preventDefault;
  if (e.deltaY < 0) {
    worldMap.controller.zoom(0.4);
  } else {
    worldMap.controller.zoom(-0.4);
  }
})

/*Toggle biomes mode*/
document.getElementById("biomes-toggle").addEventListener('change', (e) => {
  //worldMap.controller.biomesDebug();
});

/*Toggle debug mode*/
document.getElementById("debug-toggle").addEventListener('change', (e) => {
  worldMap.controller.toggleDebug();
});

/*Modal pop-up*/
let openedModals = [];

const toggleModal = (id) => {
  let modal = document.getElementById(id);
  if (modal.style.display == "none") {
    //Check if other modal opened and close them
    for (let i = openedModals.length - 1; i>=0; i--) {
      toggleModal(openedModals.pop());
    }
    //Open requested modal
    $("#"+id).fadeIn(200);
    modal.style.transform = "translateY(0px)";
    //Add it to opened modal list
    openedModals.push(id)
  } else {
    //Close requested modal
    $("#"+id).fadeOut(200);
    modal.style.transform = "translateY(80px)";
    openedModals.splice(openedModals.indexOf(id))
  }
}

//Debug modal
for (const element of document.getElementsByClassName("debug-modal-toggle")) {
  element.addEventListener('click', (e) => {
    toggleModal("debug-modal");
  });
}

//Project modal
for (const element of document.getElementsByClassName("project-modal-toggle")) {
  element.addEventListener('click', (e) => {
    toggleModal("project-modal");
  });
}