
(() => {
  const section = document.querySelector('.cinematic-sequence');
  const canvas = document.getElementById('cinematic-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const total = 2063;
  const base = 'assets/cinematic-frames/';
  const files = [];

  for (let t = 1; t <= 12; t++) {
    const folder = `Transition-${t}`;
    const count = t === 1 ? 179 : (t <= 7 ? 149 : 198);

    for (let i = 1; i <= count; i++) {
      files.push(
        `${base}${folder}/ezgif-frame-${String(i).padStart(3, '0')}.jpg`
      );
    }
  }

  const images = new Array(total);
  const loaded = new Set();
  const queue = new Set();

  let target = 0;
  let current = 0;
  let last = -1;
  let raf = 0;
  let started = false;
  let loading = 0;

  const maxConcurrent = 8;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const d = Math.min(devicePixelRatio || 1, 2);
    const w = innerWidth;
    const h = innerHeight;

    canvas.width = Math.round(w * d);
    canvas.height = Math.round(h * d);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    last = -1;
    draw(Math.round(current));
  }

  function draw(n) {
    n = Math.max(0, Math.min(total - 1, n));

    if (loaded.has(n)) {
      const im = images[n];

      if (!im || !im.complete) return;

      const w = canvas.width;
      const h = canvas.height;
      const portrait = innerWidth < 768;

      ctx.fillStyle = '#07080a';
      ctx.fillRect(0, 0, w, h);

      const scale = portrait
        ? Math.min(w / im.width, h / im.height)
        : Math.max(w / im.width, h / im.height);

      const dw = im.width * scale;
      const dh = im.height * scale;

      ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
      last = n;

      const read = document.getElementById('cinematic-frame-readout');
      if (read) {
        read.textContent = String(n + 1).padStart(4, '0') + ' / ' + total;
      }
    }
  }

  function pump() {
    while (loading < maxConcurrent && queue.size > 0) {
      const i = queue.values().next().value;
      queue.delete(i);

      if (images[i]) continue;

      const im = new Image();
      images[i] = im;
      loading++;

      im.onload = () => {
        loading--;
        loaded.add(i);

        if (i === Math.round(current)) {
          last = -1;
          draw(i);
        }

        pump();
      };

      im.onerror = () => {
        loading--;
        images[i] = null;
        pump();
      };

      im.src = files[i];
    }
  }

  function loadPriority(center) {
    queue.clear();

    const c = Math.max(0, Math.min(total - 1, center));

    // Current frame first, then nearby frames.
    for (let d = 0; d <= 90; d++) {
      const forward = c + d;
      const backward = c - d;

      if (forward < total && !images[forward]) {
        queue.add(forward);
      }

      if (backward >= 0 && !images[backward]) {
        queue.add(backward);
      }
    }

    pump();
  }

  function update() {
    raf = 0;

    const max = section.offsetHeight - innerHeight;
    const p = reduced
      ? 1
      : Math.max(
          0,
          Math.min(
            1,
            -section.getBoundingClientRect().top / Math.max(1, max)
          )
        );

    target = p * (total - 1);
    current += (target - current) * 0.2;

    const frame = Math.round(current);

    loadPriority(frame);
    draw(frame);

    const bar = document.getElementById('cinematic-progress-bar');
    if (bar) bar.style.width = (p * 100) + '%';

    const start = document.querySelector('.cinematic-copy-start');
    const end = document.querySelector('.cinematic-copy-end');

    if (start) start.style.opacity = String(Math.max(0, 1 - p * 5));
    if (end) end.style.opacity = String(Math.max(0, Math.min(1, (p - 0.82) * 6)));

    if (Math.abs(target - current) > 0.4) {
      raf = requestAnimationFrame(update);
    }
  }

  function request() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  function begin() {
    if (started) return;
    started = true;

    loadPriority(0);
    request();
  }

  addEventListener('scroll', request, { passive: true });

  addEventListener('resize', () => {
    resize();
    request();
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        begin();
        io.disconnect();
      }
    }, { rootMargin: '300px' });

    io.observe(section);
  } else {
    begin();
  }

  resize();
  begin();
})();
