// Shrinks the whole page just enough to fit the window, so there is never a
// vertical scrollbar. Does nothing when the content already fits.
(function () {
  var shell = document.querySelector(".site-shell");
  if (!shell) return;

  var MIN_SCALE = 0.4; // never shrink below 40%

  function fit() {
    // 1. Measure the natural height at 100%
    shell.style.zoom = "";
    shell.style.minHeight = "0";
    var natural = shell.offsetHeight;
    var available = window.innerHeight;

    // 2. Shrink only if needed
    var scale = Math.min(1, (available - 1) / natural);
    scale = Math.max(MIN_SCALE, Math.floor(scale * 1000) / 1000);

    if (scale < 1) {
      shell.style.zoom = scale;
      shell.style.minHeight = available / scale + "px"; // keep footer at the bottom
    } else {
      shell.style.minHeight = ""; // back to the CSS value
    }
  }

  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
