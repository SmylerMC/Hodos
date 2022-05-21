/*Link between interface and worldmap*/

/*Zoom on button click*/
document.getElementById("map-zoom-in-button").addEventListener('click', e => {
  worldMap.controller.zoom(1);
})

document.getElementById("map-zoom-out-button").addEventListener('click', e => {
  worldMap.controller.zoom(-1);
})

/*Move on mouse drag and drop*/
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

document.getElementById("map").addEventListener('mousedown', e => {
  e.preventDefault();
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  isDragging = true;
})

document.getElementById("map").addEventListener('mousemove', e => {
  if (isDragging === true) {
    let sizeFactor = WORLD_SIZE / (TILE_PIXEL_SIZE * Math.pow(2, worldMap.camera.zoom));
    let deltaX = lastMouseX - e.clientX;
    let deltaY = e.clientY - lastMouseY;
    worldMap.controller.move(deltaX * sizeFactor, deltaY * sizeFactor);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

document.addEventListener('mouseup', e => {
  isDragging = false;
});

document.addEventListener('contextmenu', e => {
  isDragging = false;
});

/*Zoom on mouse wheel*/
document.getElementById("map").addEventListener('wheel', e => {
  e.preventDefault();
  if (e.deltaY < 0) {
    worldMap.controller.zoom(0.4);
  } else {
    worldMap.controller.zoom(-0.4);
  }
})

$('#mode-form input').change(function() {
  let mode = $(this).val()
  worldMap.renderer.setRenderingMode(mode);
});

/*Toggle biomes mode*/
document.getElementById("biomes-toggle").addEventListener('change', e => {
  //worldMap.controller.biomesDebug();
});

/*Toggle debug mode*/
document.getElementById("debug-toggle").addEventListener('change', e => {
  worldMap.controller.toggleDebug();
});

/*Modal pop-up*/
let openedModals = [];

const toggleModal = (id) => {
  let modal = document.getElementById(id);
  if (modal.style.display === "none") {
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
  element.addEventListener('click', e => {
    toggleModal("debug-modal");
  });
}

//Project modal
for (const element of document.getElementsByClassName("project-modal-toggle")) {
  element.addEventListener('click', e => {
    toggleModal("project-modal");
  });
}

/*Import image*/

document.getElementById("screenshot").addEventListener('click', e => {
  let canvas = worldMap.renderer.canvas;
  let dataURL = canvas.toDataURL("image/png", 1.0);
  downloadImage(dataURL,`world-map-${canvas.width}x${canvas.height}-seed ${worldMap.generator.seed}.png`);
})

/**
 * Saves an image to disk.
 *
 * @param data      image Data
 * @param filename  the file name under which the image should be saved
 */
function downloadImage(data, filename) {
  let a = document.createElement('a');
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}  
