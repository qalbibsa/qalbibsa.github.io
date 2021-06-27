var isOffcanvasShown = false;

var menuButton = document.querySelector(".menu-button");
var offcanvas = document.querySelector(".offcanvas");

function toggleOffcanvas() {
  if (!isOffcanvasShown) {
    offcanvas.classList.toggle("offcanvas-fadeout", false);
    offcanvas.classList.toggle("offcanvas-fadein");
    isOffcanvasShown = true;
  } else {
    offcanvas.classList.toggle("offcanvas-fadein", false);
    offcanvas.classList.toggle("offcanvas-fadeout");
    isOffcanvasShown = false;
  }
}

menuButton.addEventListener("click", function () {
  toggleOffcanvas();
});

offcanvas.addEventListener("click", function (ev) {
  if (ev.target === offcanvas) {
    toggleOffcanvas();
  }
});
