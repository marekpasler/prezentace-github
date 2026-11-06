/* Deck engine: one paused GSAP timeline per slide, labels s0..sN are the click steps. */
(() => {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shell = document.getElementById('shell');
  const all = [...document.querySelectorAll('.slide')];
  const order = all.filter(s => !s.hasAttribute('data-hidden'));
  const built = new Map();
  let cur = -1, step = 0, playing = null, busy = false;

  // ---------- fit 1920×1080 into the window ----------
  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    shell.style.transform = `translate(-50%, -50%) scale(${s})`;
  };
  addEventListener('resize', fit); fit();

  // ---------- commit rail: one node per visible slide, HEAD tag follows ----------
  const rail = document.getElementById('rail');
  const head = document.getElementById('rail-head');
  const NS = 'http://www.w3.org/2000/svg';
  const y0 = 120, y1 = 960, dy = (y1 - y0) / (order.length - 1);
  const ln = document.createElementNS(NS, 'line');
  Object.entries({ x1: 56, x2: 56, y1: y0, y2: y1 }).forEach(([k, v]) => ln.setAttribute(k, v));
  rail.append(ln);
  const nodes = order.map((_, i) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', 56); c.setAttribute('cy', y0 + i * dy); c.setAttribute('r', 11);
    rail.append(c); return c;
  });
  const moveHead = (i, instant) => {
    nodes.forEach((n, k) => { n.classList.toggle('done', k < i); n.classList.toggle('head', k === i); });
    gsap.to(head, { y: y0 + i * dy - 20, duration: instant || REDUCED ? 0 : .5, ease: 'power3.out' });
    const showRail = i > 0; // cold open stays pure black
    gsap.to([rail, head], { autoAlpha: showRail ? 1 : 0, duration: instant ? 0 : .4 });
  };

  // ---------- slide lifecycle ----------
  const get = el => {
    if (!built.has(el)) {
      const def = (window.SLIDES[el.dataset.id] || (() => ({})))(el, { REDUCED });
      const tl = def.tl || gsap.timeline();
      tl.pause(0);
      const labels = Object.keys(tl.labels).filter(l => /^s\d+$/.test(l)).sort((a, b) => a.slice(1) - b.slice(1));
      if (!labels.length) { tl.addLabel('s0'); labels.push('s0'); }
      built.set(el, { ...def, tl, labels });
    }
    return built.get(el);
  };

  const goStep = (s, k, instant) => {
    playing && playing.kill();
    if (instant || REDUCED) { s.tl.pause(s.labels[k]); playing = null; }
    else playing = s.tl.tweenTo(s.labels[k], { ease: 'none' });
    s.onStep && s.onStep(k);
  };

  const show = (el, { atEnd = false, instant = false } = {}) => {
    const prevEl = all[cur] ?? null;
    if (prevEl === el) return;
    if (prevEl) {
      const p = get(prevEl);
      p.leave && p.leave();
      playing && playing.kill();
      if (instant || REDUCED) { prevEl.classList.remove('active'); gsap.set(prevEl, { clearProps: 'all' }); p.tl.pause(0); }
      else gsap.to(prevEl, { y: -40, autoAlpha: 0, duration: .4, ease: 'power3.in', onComplete: () => { prevEl.classList.remove('active'); gsap.set(prevEl, { clearProps: 'all' }); p.tl.pause(0); } });
    }
    cur = all.indexOf(el);
    const s = get(el);
    step = atEnd ? s.labels.length - 1 : 0;
    el.classList.add('active');
    s.tl.pause(0);
    s.enter && s.enter();
    const vis = order.indexOf(el);
    if (vis >= 0) moveHead(vis, instant);
    history.replaceState(null, '', '#' + (vis >= 0 ? vis + 1 : el.dataset.id));
    document.getElementById('sr').textContent = `${el.getAttribute('aria-label')}${vis >= 0 ? `, slide ${vis + 1} z ${order.length}` : ''}`;
    if (instant || REDUCED) { gsap.set(el, { autoAlpha: 1, y: 0 }); goStep(s, step, true); return; }
    gsap.fromTo(el, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .4, delay: prevEl ? .25 : 0, ease: 'power3.out',
      onComplete: () => atEnd ? goStep(s, step, true) : goStep(s, step) });
  };

  const next = () => {
    const el = all[cur], s = get(el);
    // still animating towards this step? finish it instantly first (fast clickers)
    if (playing && playing.isActive()) { playing.progress(1); return; }
    if (step < s.labels.length - 1) { step++; goStep(s, step); return; }
    const i = order.indexOf(el);
    if (i >= 0 && i < order.length - 1) show(order[i + 1]);
    else if (i < 0) show(order[order.indexOf(all[cur - 1]) + 1]); // leaving a hidden slide
  };
  const prev = () => {
    const el = all[cur], s = get(el);
    if (step > 0) { step--; goStep(s, step, true); return; }
    const i = order.indexOf(el);
    if (i > 0) show(order[i - 1], { atEnd: true, instant: true });
    else if (i < 0) show(all[cur - 1], { atEnd: true, instant: true });
  };

  // ---------- input: keyboard, presenter clickers, mouse, touch ----------
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') show(order[0], { instant: true });
    else if (k === 'End') show(order[order.length - 1], { atEnd: true, instant: true });
    else if (k === 'b' || k === 'B') { const b = document.querySelector('[data-id="backup"]'); show(b, { instant: true }); }
    else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    else if (k === 'h' || k === 'H' || k === '?') document.getElementById('help').classList.toggle('on');
  });
  addEventListener('click', e => { if (!e.target.closest('video, a, button')) next(); });
  let tx = null;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });
  let idle; addEventListener('mousemove', () => { document.body.classList.remove('hide-cursor'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.add('hide-cursor'), 2000); });

  // pause rAF loops when the tab is hidden (only slides that run a loop; leave() may reset state)
  document.addEventListener('visibilitychange', () => {
    const s = cur >= 0 && get(all[cur]);
    if (!s || !s.loop) return;
    document.hidden ? s.leave && s.leave() : s.enter && s.enter(true);
  });

  // ---------- start (after fonts, so SplitText measures real glyphs) ----------
  document.fonts.ready.then(() => {
    const h = location.hash.slice(1);
    const start = /^\d+$/.test(h) ? order[Math.min(+h, order.length) - 1] : (all.find(s => s.dataset.id === h) || order[0]);
    show(start, { instant: true });
  });

  window.DECK = { next, prev, show, order, get state() { return { slide: all[cur]?.dataset.id, step } } };
})();
