// Simple subtle particle/starfield + gentle parallax.

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const rootStyles = getComputedStyle(document.documentElement);
  const accentColor = rootStyles.getPropertyValue('--accent').trim();
    let textColor = rootStyles.getPropertyValue('--text').trim();

  // Re-read the color whenever the theme (data-theme on <html>) changes
  new MutationObserver(() => {
    textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

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

  // Detect whether the last user interaction was from keyboard so we can show focus styles
  // for keyboard users but not for mouse click (which often causes lingering focus on return).
  let lastInteractionWasKeyboard = false;
  window.addEventListener('keydown', () => { lastInteractionWasKeyboard = true; }, true);
  window.addEventListener('pointerdown', () => { lastInteractionWasKeyboard = false; }, true);

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('focus', () => {
      // Apply focus style only for keyboard focus or when :focus-visible is supported
      if (btn.matches(':focus-visible') || lastInteractionWasKeyboard) {
        btn.style.boxShadow = `0 0 0 4px ${focusShadow}`;
      }
    });
    btn.addEventListener('blur', () => btn.style.boxShadow = 'none');
    // Also remove any focus style and blur on pointerdown to avoid leaving a focused state
    btn.addEventListener('pointerdown', () => { btn.style.boxShadow = 'none'; btn.blur(); });
    // ensure mobile taps also clear any focus/box-shadow
    btn.addEventListener('touchstart', () => { btn.style.boxShadow = 'none'; btn.blur(); }, {passive: true});
    btn.addEventListener('click', () => { btn.style.boxShadow = 'none'; btn.blur(); });
  });

  // When returning to the page, clear any lingering focus/inline styles that some mobile browsers keep.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      try {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        document.querySelectorAll('.btn').forEach(b => { b.style.boxShadow = 'none'; });
      } catch (e) { /* ignore */ }
    }
  });

})();

// Blog tabs and posts functionality
(function () {
  const homeView = document.getElementById('home-view');
  const blogView = document.getElementById('blog-view');
  const blogGrid = document.getElementById('blog-grid');
  const topicLinks = document.querySelectorAll('.topic-link');
  const backLink = document.getElementById('back-home');

  // Sample blog posts - replace with your actual content
  const blogPosts = [
    {
      title: 'Getting Started with CTF Challenges',
      excerpt: 'A beginner\'s guide to Capture The Flag competitions and how to get started in cybersecurity.',
      tag: 'ctf',
      tagLabel: 'CTF',
      date: 'Apr 10, 2026',
      readTime: '5 min read'
    },
    {
      title: 'Understanding AI Model Architectures',
      excerpt: 'Deep dive into how modern AI models are structured and trained for various tasks.',
      tag: 'ai',
      tagLabel: 'AI',
      date: 'Apr 5, 2026',
      readTime: '8 min read'
    },
    {
      title: 'Building Secure APIs',
      excerpt: 'Best practices for designing and implementing secure REST APIs in modern applications.',
      tag: 'security',
      tagLabel: 'Security',
      date: 'Mar 28, 2026',
      readTime: '6 min read'
    },
    {
      title: 'My Journey into Problem Solving',
      excerpt: 'How I developed my approach to tackling complex programming challenges.',
      tag: 'blogs',
      tagLabel: 'Blog',
      date: 'Mar 20, 2026',
      readTime: '4 min read'
    },
    {
      title: 'Web Application Pentesting Basics',
      excerpt: 'Common vulnerabilities in web apps and how to identify them during security audits.',
      tag: 'security',
      tagLabel: 'Security',
      date: 'Mar 15, 2026',
      readTime: '7 min read'
    },
    {
      title: 'Automating Tasks with Python',
      excerpt: 'Practical examples of using Python scripts to automate repetitive development workflows.',
      tag: 'dev',
      tagLabel: 'Dev',
      date: 'Mar 8, 2026',
      readTime: '5 min read'
    }
  ];

  function renderPosts(filter = 'all') {
    const filtered = filter === 'all'
      ? blogPosts
      : blogPosts.filter(post => post.tag === filter);

    if (filtered.length === 0) {
      blogGrid.innerHTML = '<div class="blog-empty">No posts yet for this category. Check back soon!</div>';
      return;
    }

    blogGrid.innerHTML = filtered.map(post => `
      <article class="blog-card" data-tag="${post.tag}">
        <div class="blog-card-header">
          <span class="blog-tag">${post.tagLabel}</span>
          <span class="blog-date">${post.date}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="blog-card-footer">${post.readTime}</div>
      </article>
    `).join('');
  }

  function showBlog(tab) {
    homeView.style.display = 'none';
    blogView.style.display = '';
    renderPosts(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showHome() {
    blogView.style.display = 'none';
    homeView.style.display = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  topicLinks.forEach(link => {
    link.addEventListener('click', () => {
      showBlog(link.dataset.tab);
    });
  });

  if (backLink) {
    backLink.addEventListener('click', () => {
      showHome();
    });
  }
})();

