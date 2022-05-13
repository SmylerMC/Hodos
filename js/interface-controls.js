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