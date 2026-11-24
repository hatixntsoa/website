// Glitch / scramble animation on the name, ported from the Preact island.
(function () {
  var content = window.SITE_CONTENT;
  var root = document.getElementById("electric-name");
  if (!content || !root) return;

  var NAME = content.capitalName;
  var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var CURSOR = "░▒▓█";
  var DURATION = 1200;
  var PAUSE = 2600;

  function el(className, text) {
    var s = document.createElement("span");
    if (className) s.className = className;
    if (text !== undefined) s.textContent = text;
    return s;
  }

  // ----- Build the DOM -----
  var glyphs = []; // glyphs[i] is the element showing NAME[i]
  var offset = 0;

  var srOnly = el("sr-only", NAME);
  var visual = el();
  visual.setAttribute("aria-hidden", "true");

  NAME.split(" ").forEach(function (word, wordIndex) {
    if (wordIndex > 0) visual.appendChild(document.createTextNode(" "));
    var wordEl = el("electric-name-word");

    Array.from(word).forEach(function (letter) {
      var letterEl = el("electric-name-letter");
      var glyph = el("electric-name-glyph", letter);
      letterEl.appendChild(el("electric-name-placeholder", letter));
      letterEl.appendChild(glyph);
      wordEl.appendChild(letterEl);
      glyphs[offset++] = glyph;
    });

    offset++; // skip the space
    visual.appendChild(wordEl);
  });

  root.appendChild(srOnly);
  root.appendChild(visual);

  function show(text) {
    glyphs.forEach(function (glyph, i) {
      glyph.textContent = text[i];
    });
  }

  // ----- Animation -----
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var frame = 0;
  var timeout;

  function stop() {
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
    show(NAME);
  }

  function animate() {
    var started = performance.now();
    var lastUpdate = -Infinity;

    function tick(now) {
      var elapsed = now - started;

      if (elapsed >= DURATION) {
        show(NAME);
        timeout = setTimeout(animate, PAUSE);
        return;
      }

      if (now - lastUpdate >= 1000 / 30) {
        lastUpdate = now;
        var text = Array.from(NAME, function (letter, index) {
          if (letter === " ") return letter;
          var distance = Math.abs(index - (NAME.length - 1) / 2);
          var progress =
            (elapsed - distance * 35) /
            (DURATION - ((NAME.length - 1) / 2) * 35);
          if (progress <= 0 || progress >= 1) return letter;
          if (progress < 0.3) {
            return CURSOR[Math.min(3, Math.floor(progress / 0.075))];
          }
          return LETTERS[Math.floor(Math.random() * LETTERS.length)];
        }).join("");
        show(text);
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
  }

  function updateMotion() {
    stop();
    if (!motion.matches) animate();
  }

  updateMotion();
  motion.addEventListener("change", updateMotion);
})();
