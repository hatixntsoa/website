// Simple subtle particle/starfield + gentle parallax.

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const rootStyles = getComputedStyle(document.documentElement);
  const accentColor = rootStyles.getPropertyValue('--accent').trim();
  const textColor = rootStyles.getPropertyValue('--text').trim();

  let cw, ch, stars;
  let pointerX = 0;
  let pointerY = 0;
  let parallaxX = 0;
  let parallaxY = 0;

  const PARALLAX_MAX_X = 12;
  const PARALLAX_MAX_Y = 8;

  function cssColorWithAlpha(color, alpha) {
    if (!color) return `rgba(0,0,0,${alpha})`;
    color = color.trim();
    if (color.startsWith('rgb')) {
      const nums = color.match(/\d+/g);
      return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
    }
    if (color.startsWith('#')) {
      let hex = color.slice(1);
      if (hex.length === 3) hex = hex.split('').map(ch => ch + ch).join('');
      const int = parseInt(hex, 16);
      const r = (int >> 16) & 255;
      const g = (int >> 8) & 255;
      const b = int & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  function resize() {
    cw = canvas.width = innerWidth;
    ch = canvas.height = innerHeight;

    if (!pointerX) pointerX = cw / 2;
    if (!pointerY) pointerY = ch / 2;
    initStars();
  }

  function initStars() {
    const count = Math.round((cw * ch) / 9000); // density
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.06,
        z: Math.random()
      });
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) * 0.001, 0.05);
    last = now;
    ctx.clearRect(0, 0, cw, ch);

    const targetPX = ((pointerX || cw/2) / cw - 0.5) * PARALLAX_MAX_X;
    const targetPY = ((pointerY || ch/2) / ch - 0.5) * PARALLAX_MAX_Y;
    parallaxX += (targetPX - parallaxX) * 0.08;
    parallaxY += (targetPY - parallaxY) * 0.08;

    // draw & animate stars (drift + slight wobble)
    for (let s of stars) {
      const wobbleX = 1 + Math.sin(now * (0.0004 + s.r * 0.0002));
      const wobbleY = 1 + Math.cos(now * (0.00035 + s.r * 0.00015));
      s.x += s.vx * wobbleX * 60 * dt;
      s.y += s.vy * wobbleY * 60 * dt;

      // wrap-around
      if (s.x < 0) s.x = cw;
      if (s.x > cw) s.x = 0;
      if (s.y < 0) s.y = ch;
      if (s.y > ch) s.y = 0;

      // compute per-star parallax scaled by depth so nearer stars shift more
      const drawX = s.x + parallaxX * (0.6 + s.z * 0.8);
      const drawY = s.y + parallaxY * (0.6 + s.z * 0.8);

      ctx.beginPath();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = textColor || '#000000';
      ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }

  // pointer tracking for parallax: update pointer target but don't modify canvas transform
  window.addEventListener('mousemove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
  });

  // support touch move for parallax on mobile
  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    pointerX = t.clientX;
    pointerY = t.clientY;
  }, {passive: true});

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);

  const focusShadow = cssColorWithAlpha(accentColor, 0.12);
  const blurShadow = cssColorWithAlpha(textColor, 0.45);
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('focus', () => btn.style.boxShadow = `0 0 0 4px ${focusShadow}`);
    btn.addEventListener('blur', () => btn.style.boxShadow = `0 6px 18px ${blurShadow}`);
  });

})();