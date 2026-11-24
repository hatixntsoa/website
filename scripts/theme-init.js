// Runs in <head> so the saved theme is applied before the first paint.
(function () {
  var theme = "light"; // fallback when nothing else is available

  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      theme = saved; // the visitor's own choice always wins
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      theme = "dark"; // system is set to dark
    }
  } catch (e) {
    // Storage blocked: stay on the light fallback.
  }

  document.documentElement.dataset.theme = theme;
})();
