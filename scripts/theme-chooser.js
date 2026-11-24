// Light / Dark toggle, persisted in localStorage and synced across tabs.
(function () {
  var buttons = document.querySelectorAll("[data-theme-choice]");
  if (!buttons.length) return;

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    buttons.forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === theme)
      );
    });
  }

  apply(document.documentElement.dataset.theme === "light" ? "light" : "dark");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var theme = button.dataset.themeChoice;
      apply(theme);
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        // Theme still works when browser storage is unavailable.
      }
    });
  });

  window.addEventListener("storage", function (event) {
    if (event.key !== "theme" && event.key !== null) return;
    apply(event.newValue === "light" ? "light" : "dark");
  });
})();
