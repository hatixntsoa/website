// Simple subtle particle/starfield + gentle parallax.

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let cw, ch, stars;

  function resize() {
    cw = canvas.width = innerWidth;
    ch = canvas.height = innerHeight;
    initStars();
  }

  function initStars() {
    const count = Math.round((cw * ch) / 9000); // density
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.05
      });
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = (now - last) * 0.001;
    last = now;
    ctx.clearRect(0, 0, cw, ch);

    // subtle vignette
    const g = ctx.createLinearGradient(0, 0, 0, ch);
    g.addColorStop(0, 'rgba(0,0,0,0.0)');
    g.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);

    // draw stars
    for (let s of stars) {
      s.x += s.vx * (1 + Math.sin(now * 0.0005));
      if (s.x < 0) s.x = cw;
      if (s.x > cw) s.x = 0;

      ctx.beginPath();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }

  // parallax on mouse
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / cw - 0.5) * 12;
    const ny = (e.clientY / ch - 0.5) * 8;
    canvas.style.transform = `translate(${nx}px, ${ny}px)`;
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);

  // Accessibility: add focus outlines to the dynamic buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('focus', () => btn.style.boxShadow = `0 0 0 4px rgba(0,133,255,0.12)`);
    btn.addEventListener('blur', () => btn.style.boxShadow = `0 6px 18px rgba(0,0,0,0.45)`);
  });

})();