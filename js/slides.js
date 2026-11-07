/* Slide timelines. Each factory returns { tl, enter?, leave?, onStep?, loop? }; tl.step() marks a click stop (s0, s1, …).
   Motion system "Premium" — one family, no overshoot:
     enter / settle = power3.out    exit = power3.in    travel between two points = power3.inOut
     durations: Q = 0.3 s (swap, dim, state)   M = 0.6 s (enter, title)   L = 1.2 s (travel, count, draw)
     entrance = rise 24 px + fade; headings = word mask; stagger ≤ 4 items × 0.06 s
     banned: bounce, back/elastic overshoot, shake, glow, full-screen flash, decorative rotation */
gsap.registerPlugin(SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin);
const Q = .3, M = .6, L = 1.2, RISE = 24, STEP = .06;
const IN = 'power3.out', OUT = 'power3.in', MOVE = 'power3.inOut';
gsap.defaults({ ease: IN, duration: M });

const NS = 'http://www.w3.org/2000/svg';
const T = () => { const tl = gsap.timeline({ paused: true }); let k = 0; tl.step = () => tl.addLabel('s' + k++); return tl; };
const $ = (el, q) => el.querySelector(q);
const $$ = (el, q) => [...el.querySelectorAll(q)];
const svg = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.append(n); return n; };
const C = DATA.commits;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// the one entrance: rise + fade
const rise = (tl, els, at, opts = {}) => tl.from(els, { y: RISE, autoAlpha: 0, duration: M, stagger: STEP, ...opts }, at);
// headings: words rise out of a line mask
const title = (tl, nodes, at = 0) => {
  [].concat(nodes).filter(Boolean).forEach((n, i) => {
    const sp = SplitText.create(n, { type: 'lines,words', mask: 'lines', linesClass: 'tl', wordsClass: 'tw' });
    tl.from(sp.words, { yPercent: 110, duration: M, stagger: .04 }, i ? '<.08' : at);
  });
};
// type a string one character per tick (seek-safe: display toggles revert on rewind) — only for code, never headings
const typeInto = (tl, el, text, cps = .045) => {
  el.innerHTML = [...text].map(c => `<span style="display:none">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  $$(el, 'span').forEach(s => tl.set(s, { display: 'inline' }, `+=${cps}`));
};
// video slides: s0 = poster frame, s1 = the film plays to its end and holds
const film = (el, seconds) => {
  const tl = T(), v = $(el, 'video');
  tl.step();
  tl.to({}, { duration: seconds });
  tl.step();
  const at = (k, instant) => {
    if (k === 0) { v.pause(); v.currentTime = 0; return; }
    if (instant) { v.pause(); v.currentTime = Math.max(0, (v.duration || seconds) - .05); return; }
    v.currentTime = 0; v.play().catch(() => {});
  };
  return { tl, onStep: at, enter() { v.pause(); v.currentTime = 0; }, leave() { v.pause(); } };
};

window.SLIDES = {
  /* 1 — HyperFrames film: terminal push, digital rain, the URL */
  cold(el) { return film(el, 8.5); },

  /* 2 — question to the room, then the folder everyone has */
  zips(el) {
    const tl = T(), files = $$(el, '.file');
    title(tl, $(el, '.t-mask'));
    tl.step();
    rise(tl, files);
    tl.to($(el, '.file.last'), { borderColor: '#ff7b72', duration: Q }, '+=.1');
    tl.step();
    return { tl };
  },

  /* 3 — Remotion film: 2005 → 2025 (click to play, like the cold open) */
  story(el) { return film(el, 15.5); },

  /* 4 — Git = camera, GitHub = album: one snapshot travels */
  gitvs(el) {
    const tl = T(), album = $(el, '.album'), photo = $(el, '.photo');
    album.innerHTML = Array.from({ length: 8 }, (_, i) => `<div style="height:130px;border-radius:8px;border:3px ${i === 7 ? 'dashed var(--muted)' : 'solid var(--line)'};background:${i === 7 ? 'transparent' : 'var(--surface)'}"></div>`).join('');
    tl.set(photo, { autoAlpha: 0 });
    title(tl, $$(el, '.col .t-mask'));
    rise(tl, $$(el, '.col .body'), '<.2');
    tl.from(album.children, { autoAlpha: 0, duration: M, stagger: { amount: .24 } }, '<.1');
    tl.step();
    tl.to(photo, { autoAlpha: 1, duration: Q });
    tl.to(photo, { motionPath: { path: [{ x: 700, y: -200 }, { x: 1410, y: 150 }], curviness: 1.1 }, duration: L, ease: MOVE });
    tl.to(album.children[7], { borderColor: '#f0f6fc', borderStyle: 'solid', duration: Q }, '-=.15');
    tl.step();
    return { tl };
  },

  /* 5 — expanding brain: each row a step up in how you share a website */
  brain(el) {
    const tl = T(), rows = $(el, '.brain-rows');
    const STAGES = [['poslat web mailem jako .zip', '#6e7681'], ['Google Disk', '#1e9e74'], ['GitHub', '#5effc4'], ['GitHub Pages', '#d7fff0']];
    const brain = `<svg viewBox="0 0 200 140" style="width:200px;height:140px;flex:none"><path d="M100 18c-10-10-34-12-46 2-16-2-30 10-30 26-14 6-18 26-6 38-4 18 10 34 28 32 8 12 30 14 42 4 2-2 10-2 12 0 12 10 34 8 42-4 18 2 32-14 28-32 12-12 8-32-6-38 0-16-14-28-30-26-12-14-36-12-46-2z M100 18v112 M56 50c10 4 14 14 10 24 M144 50c-10 4-14 14-10 24 M44 92c12-2 22 4 24 14 M156 92c-12-2-22 4-24 14" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    rows.innerHTML = STAGES.map(([t], i) => `<div class="br-row" style="display:flex;align-items:center;justify-content:space-between;height:200px;border-bottom:2px solid var(--line)"><span class="h2" style="font-weight:600;opacity:${.55 + i * .15}">${t}</span>${brain}</div>`).join('');
    $$(rows, '.br-row').forEach((r, i) => {
      gsap.set($(r, 'path'), { stroke: STAGES[i][1] });
      if (i) tl.step();
      rise(tl, r);
    });
    tl.step();
    return { tl };
  },

  /* 6 — real file tree; folders unfold top-down; .git is the memory */
  repo(el) {
    const tl = T(), box = $(el, '.tree'), LH = 46;
    const lines = [];
    const walk = (node, depth, prefix, path) => {
      const keys = Object.keys(node).sort((a, b) => (node[b] !== null) - (node[a] !== null) || a.localeCompare(b));
      keys.forEach((k, i) => {
        const lastChild = i === keys.length - 1, dir = node[k] !== null;
        lines.push({ text: prefix + (lastChild ? '└── ' : '├── '), name: k + (dir ? '/' : ''), dir, depth, path: path + k });
        if (dir) walk(node[k], depth + 1, prefix + (lastChild ? '    ' : '│   '), path + k + '/');
      });
    };
    walk(DATA.tree, 0, '', '');
    const gitLines = [['├── ', '.git/'], ['│   ├── ', 'HEAD'], ['│   ├── ', 'objects/'], ['│   └── ', 'refs/']];
    const row = (cls, attrs, inner) => `<div class="ln ${cls}" ${attrs} style="height:${LH}px;line-height:${LH}px;overflow:hidden;white-space:pre">${inner}</div>`;
    box.innerHTML =
      row('root', '', '<b>plesoktava/</b>') +
      gitLines.map(([p, n]) => row('git', '', `<span class="muted">${p}</span><span class="mint" style="font-weight:600">${n}</span>${n === '.git/' ? '<span class="mint" style="font-family:var(--sans)">   ← tady je ta paměť</span>' : ''}`)).join('') +
      lines.map(l => row('', `data-path="${l.path}" data-depth="${l.depth}"`, `<span class="muted">${l.text}</span><span style="color:${l.dir ? 'var(--mint)' : 'var(--ink)'}">${esc(l.name)}</span>`)).join('');
    const sel = f => $$(box, '.ln[data-path]').filter(n => f(n.dataset.path, +n.dataset.depth));
    const top = sel((p, d) => d === 0), assets = sel(p => /^assets\/[^/]+$/.test(p)), img = sel(p => /^assets\/img\/./.test(p));
    tl.set([...$$(box, '.ln.git'), ...sel((p, d) => d > 0)], { height: 0, autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, $(el, '.body'), '<.2');
    tl.from([$(box, '.root'), ...top], { autoAlpha: 0, duration: M, stagger: { amount: .25 } }, '<');
    tl.step();
    // the tree grows downward: height is the mechanism here (children push siblings down)
    const unfold = group => tl.to(group, { height: LH, autoAlpha: 1, duration: M, stagger: { amount: .24 } });
    unfold(assets); tl.step();
    unfold(img); tl.step();
    unfold($$(box, '.ln.git')); tl.step();
    return { tl };
  },

  /* 7 — real one-line diff of commit 9cc712d */
  commit(el) {
    const tl = T();
    const del = $(el, '.row.del'), add = $(el, '.row.add'), stamp = $(el, '.stamp'), hash = $(el, '.hash'), snap = $(el, '.snap');
    tl.set(add, { autoAlpha: 0, y: -RISE }).set([stamp, snap], { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, [$(el, '.diff'), $(el, '.src')], '<.15');
    tl.step();
    // the old line leaves upward, the new one drops into the same slot
    tl.to(del, { y: -RISE, autoAlpha: 0, duration: Q, ease: OUT });
    tl.to(add, { y: 0, autoAlpha: 1, duration: M });
    tl.step();
    tl.fromTo(stamp, { autoAlpha: 0, y: RISE }, { autoAlpha: 1, y: 0, duration: M });
    tl.to(hash, { scrambleText: { text: '9cc712d', chars: '0123456789abcdef', revealDelay: .25, speed: .6 }, duration: .9, ease: 'none' }, '<');
    tl.step();
    // diff view: both lines, old above new — the diff is computed from two snapshots
    tl.to(add, { y: 90, duration: M, ease: MOVE });
    tl.to(del, { y: 0, autoAlpha: 1, duration: M }, '<.1');
    tl.to(snap, { autoAlpha: 1, duration: M }, '<.2').from(snap, { y: RISE, duration: M }, '<');
    tl.step();
    return { tl };
  },

  /* 8 — Ctrl+Z ×300 versus one revert */
  revert(el) {
    const tl = T(), zc = $(el, '.zc');
    tl.set(zc, { textContent: 0 }).set($(el, '.vs-r'), { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, [$(el, '.chip'), $(el, '.vs-l')], '<.15');
    tl.step();
    tl.to(zc, { textContent: 300, snap: { textContent: 1 }, duration: L, ease: OUT });
    tl.step();
    tl.to($(el, '.vs-r'), { autoAlpha: 1, duration: Q }).from($(el, '.vs-r'), { y: RISE, duration: M }, '<');
    tl.step();
    return { tl };
  },

  /* 9 — git log on a real time axis; three real stories */
  history(el) {
    const tl = T(), s = $(el, '.tl'), notes = $(el, '.notes');
    const ts = C.map(c => +new Date(c.date)), t0 = ts[0], t1 = ts[ts.length - 1], xs = [];
    ts.forEach((t, i) => { const raw = 220 + (t - t0) / (t1 - t0) * 1560; xs.push(i ? Math.max(raw, xs[i - 1] + 9) : raw); });
    const kx = 1560 / (xs[xs.length - 1] - 220);
    const X = i => 220 + (xs[i] - 220) * kx, Y = 600;
    const base = svg('path', { d: `M220 ${Y} H1780`, stroke: '#3d444d', 'stroke-width': 6, fill: 'none' }, s);
    const dots = C.map((c, i) => svg('circle', { cx: X(i), cy: Y, r: Math.min(20, 8 + Math.sqrt(c.add + c.del) * .4), fill: '#1e5c47', stroke: '#5effc4', 'stroke-width': 3 }, s));
    const days = {};
    C.forEach((c, i) => { const key = `${+c.date.slice(8, 10)}. ${+c.date.slice(5, 7)}.`; if (!(key in days)) days[key] = i; });
    const TICKS = [['7. 10.', 'start'], ['26. 10.', 'middle'], ['6. 11.', 'end']];
    const ticks = TICKS.map(([k, a]) => { const t = svg('text', { x: a === 'end' ? 1780 : X(days[k]), y: Y + 90, 'text-anchor': a, fill: '#b7c0ca', 'font-family': 'Plex Mono', 'font-size': 40 }, s); t.textContent = k; return t; });
    const idx = h => C.findIndex(c => c.short === h);
    const STORIES = [
      { at: [idx('6a92b55')], x: 220, y: 240, when: '7. 10. 21:10', what: `první commit: celý web, ${C[0].add} řádků` },
      { at: [idx('ccc1664'), idx('ec31a86'), idx('87a9e0a')], x: X(idx('ccc1664')) - 40, y: 740, when: '13. 10. 13:59–14:02', what: 'Create, Delete, Create CNAME: 3,5 minuty' },
      { at: [idx('b63730d')], x: 1100, y: 240, when: '14. 10. 23:05', what: 'oprava v noci: © 2027 → 2026' },
    ];
    const counter = $(el, '.n');
    tl.set(counter, { textContent: 0 });
    tl.from(base, { drawSVG: 0, duration: L, ease: MOVE });
    tl.to(counter, { textContent: C.length, snap: { textContent: 1 }, duration: L, ease: MOVE }, '<');
    tl.from(dots, { autoAlpha: 0, duration: Q, stagger: { amount: L - .2 } }, '<.1');
    rise(tl, [...ticks, $(el, '.src')], '-=.3');
    tl.step();
    STORIES.forEach(st => {
      const n = document.createElement('div');
      n.style.cssText = `position:absolute;left:${st.x}px;top:${st.y}px`;
      n.innerHTML = `<div class="mono mint" style="font-size:40px">${st.when}</div><div style="font-size:44px;margin-top:8px;font-weight:600">${st.what}</div>`;
      notes.append(n);
      const leads = st.at.map(i => svg('path', { d: `M${X(i)} ${Y + (st.y < Y ? -24 : 24)} L${st.x + 20} ${st.y < Y ? st.y + 124 : st.y - 16}`, stroke: '#5effc4', 'stroke-width': 3, fill: 'none' }, s));
      tl.to(st.at.map(i => dots[i]), { fill: '#5effc4', duration: Q, stagger: STEP });
      tl.from(leads, { drawSVG: 0, duration: M, ease: MOVE }, '<');
      rise(tl, n, '<.2');
      tl.step();
    });
    return { tl };
  },

  /* 10 — what the teacher sees in my git log (real commits, 14. 10. evening) */
  teacher(el) {
    const tl = T(), box = $(el, '.lg'), tag = $(el, '.cnt19');
    const pick = C.slice(15, 25);
    const d = c => `${+c.date.slice(8, 10)}.${+c.date.slice(5, 7)}. ${c.date.slice(11, 16)}`;
    box.innerHTML = `<div class="hd"><span class="prompt">$ </span>git log --reverse --since="2026-10-14 21:05" --until="2026-10-15"</div>` +
      pick.map(c => `<div class="lgl" style="white-space:pre"><span style="color:var(--amber)">${c.short}</span>  <span class="muted">${d(c)}</span>  ${esc(c.message)}</div>`).join('') +
      `<div class="q1" style="margin-top:22px"><span class="prompt">$ </span>git log --oneline --grep="Update index.html" | wc -l</div><div class="q2 mint" style="font-weight:600">${C.filter(c => c.message === 'Update index.html').length}</div>`;
    const ls = $$(box, '.lgl'), night = ls[ls.length - 1];
    tl.set([$(box, '.q1'), $(box, '.q2'), tag], { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, $(el, '.logp'), '<.15');
    tl.from(ls, { autoAlpha: 0, duration: Q, stagger: { amount: .5 } });
    tl.step();
    tl.to(night, { backgroundColor: 'rgba(94,255,196,.16)', duration: Q });
    tl.to(ls.slice(0, -1), { opacity: .45, duration: Q }, '<');
    tl.step();
    tl.to(ls.slice(-1), { opacity: .45, backgroundColor: 'rgba(94,255,196,0)', duration: Q });
    tl.to($(box, '.q1'), { autoAlpha: 1, duration: Q }, '<');
    tl.to($(box, '.q2'), { autoAlpha: 1, duration: Q }, '+=.3');
    tl.to(tag, { autoAlpha: 1, duration: Q }, '<').from(tag, { y: RISE, duration: M }, '<');
    tl.step();
    return { tl };
  },

  /* 11 — git blame: every line points at the presenter */
  blame(el) {
    const tl = T(), box = $(el, '.blame');
    const BL = [ // real `git blame -L 413,415 index.html` of the ball website, code trimmed to fit
      ['40602465', '06.11. 17:49', '<!-- Stav prodeje je i v příkazu…'],
      ['d4143743', '06.11. 17:09', '<strong>Zbývají poslední lístky.'],
      ['d4143743', '06.11. 17:09', 'Kup si ho v naší třídě P02…'],
    ];
    box.innerHTML = `<div><span class="prompt">$ </span>git blame index.html</div>` + BL.map(([h, dt, code]) =>
      `<div class="bl" style="white-space:pre"><span style="color:var(--amber)">${h}</span> (<span class="who">marekpasler</span> <span class="muted">${dt}</span>) ${esc(code)}</div>`).join('');
    const verdict = $(el, '.verdict');
    tl.set(verdict, { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, [...box.children, $(el, '.src')], '<.15');
    tl.step();
    tl.to($$(box, '.who'), { color: '#0d1117', backgroundColor: '#5effc4', duration: Q, stagger: STEP });
    tl.step();
    tl.to(verdict, { autoAlpha: 1, duration: Q }).from(verdict, { y: RISE * 2, duration: L }, '<');
    tl.step();
    return { tl };
  },

  /* 12 — metro map; HEAD rides the branch; conflict as an inset card */
  branch(el) {
    const tl = T(), q = c => $(el, c);
    const head = q('.headptr'), stAfter = q('.st-after circle'), stMain = $$(el, '.st-main circle'), stBr = $$(el, '.st-br circle'), card = q('.cfcard'), metro = q('.metro');
    gsap.set([...stMain, stAfter], { attr: { fill: '#0d1117', stroke: '#b7c0ca', 'stroke-width': 10 } });
    gsap.set(stBr, { attr: { fill: '#0d1117', stroke: '#5effc4', 'stroke-width': 10 } });
    tl.set(head, { x: 760, y: 680 });
    tl.set([q('.out'), q('.in')], { drawSVG: 0 }).set([...stBr, stAfter, q('.st-merge'), q('.lb-br'), q('.lb-merge'), card], { autoAlpha: 0 });
    title(tl, q('.t-mask'));
    rise(tl, q('.chip'), '<.2');
    tl.from(q('.main'), { drawSVG: 0, duration: L, ease: MOVE }, '<');
    tl.from(stMain, { autoAlpha: 0, duration: Q, stagger: .1 }, '<.3');
    tl.from([q('.lb-main'), head], { autoAlpha: 0, duration: Q });
    tl.step();
    tl.to(q('.lb-br'), { autoAlpha: 1, duration: Q });
    tl.to(q('.out'), { drawSVG: '100%', duration: L, ease: MOVE }, '<');
    tl.to(head, { motionPath: { path: '#br-out' }, duration: L, ease: MOVE }, '<');
    stBr.forEach((c, i) => tl.to(c, { autoAlpha: 1, duration: Q }, `<${i ? .18 : .6}`));
    tl.step();
    tl.to(q('.in'), { drawSVG: '100%', duration: L, ease: MOVE });
    tl.to(head, { motionPath: { path: '#br-in' }, duration: L, ease: MOVE }, '<');
    tl.to(q('.st-merge'), { autoAlpha: 1, duration: Q }, '-=.2');
    tl.to([q('.lb-merge'), stAfter], { autoAlpha: 1, duration: Q });
    tl.step();
    tl.to(metro, { opacity: 0, duration: Q, ease: OUT });
    tl.to(card, { autoAlpha: 1, duration: Q }, '<').from(card, { y: RISE, duration: M }, '<');
    tl.step();
    return { tl };
  },

  /* 13 — a pull request (illustration): checks run, a review lands, merge */
  pr(el) {
    const tl = T(), card = $(el, '.prcard'), chk = $(el, '.chk'), rev = $(el, '.rev'), btn = $(el, '.pr-btn'), state = $(el, '.pr-state');
    tl.set($(chk, '.ok'), { autoAlpha: 0 }).set(rev, { autoAlpha: 0 }).set(btn, { opacity: .35 });
    title(tl, $(el, '.t-mask'));
    rise(tl, [$(el, '.chip'), card], '<.15');
    tl.step();
    tl.to($(chk, '.p'), { autoAlpha: 0, duration: Q }, '+=.5');
    tl.to($(chk, '.ok'), { autoAlpha: 1, duration: Q }, '<');
    tl.to(rev, { autoAlpha: 1, duration: Q }, '+=.2').from(rev, { y: RISE, duration: M }, '<');
    tl.to(btn, { opacity: 1, duration: Q });
    tl.step();
    tl.to(btn, { opacity: .35, duration: Q });
    tl.to(state, { opacity: 0, duration: .15, ease: OUT }, '<');
    tl.set(state, { className: 'pr-state merged' }).set($(state, '.o'), { display: 'none' }).set($(state, '.m'), { display: 'inline' });
    tl.to(state, { opacity: 1, duration: Q });
    tl.step();
    return { tl };
  },

  /* 14 — open source (illustration): star it, fork it, send a PR back */
  fork(el) {
    const tl = T(), a = $(el, '.rc-a'), b = $(el, '.rc-b'), star = $(el, '.star'), cnt = $(el, '.cnt'), fcnt = $(el, '.fcnt');
    tl.set([b, $(el, '.fork-pr')], { autoAlpha: 0 }).set([$(el, '.fa1'), $(el, '.fa2')], { drawSVG: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, [$(el, '.chip'), a], '<.15');
    tl.step();
    // sets sit just after the stop, otherwise they fire while the slide rests on the previous step
    tl.set(star, { className: 'rc-btn star on' }, '+=.01').set(cnt, { textContent: '1' }, '<');
    tl.fromTo(star, { opacity: .4 }, { opacity: 1, duration: Q, immediateRender: false }, '<');
    tl.step();
    tl.set(fcnt, { textContent: '1' }, '+=.01');
    tl.to(b, { autoAlpha: 1, duration: Q });
    tl.from(b, { x: -680, y: -320, duration: L, ease: MOVE }, '<');
    tl.to($(el, '.fa1'), { drawSVG: '100%', duration: M }, '-=.4');
    tl.step();
    tl.to($(el, '.fa2'), { drawSVG: '100%', duration: L, ease: MOVE });
    tl.to($(el, '.fork-pr'), { autoAlpha: 1, duration: Q }, '-=.3');
    tl.step();
    return { tl };
  },

  /* 15 — Octoverse numbers + an estimate that ticks while the slide is up */
  numbers(el) {
    const tl = T(), cs = $$(el, '.c'), tick = $(el, '.t');
    tl.set(cs, { textContent: 0 });
    rise(tl, $$(el, '.nums > div'));
    cs.forEach((c, i) => tl.to(c, { textContent: +c.dataset.to, snap: { textContent: 1 }, duration: L, ease: IN }, i * .1));
    rise(tl, [$(el, '.tick'), $(el, '.src')], '-=.5');
    tl.step();
    let iv = 0, t0 = 0;
    return {
      tl, loop: true,
      enter(resume) {
        if (!resume) t0 = Date.now();
        const upd = () => { tick.textContent = Math.floor((Date.now() - t0) / 1000); };
        upd(); clearInterval(iv); iv = setInterval(upd, 250);
      },
      leave() { clearInterval(iv); },
    };
  },

  /* 16 — files leave the repo and become the website */
  pages(el) {
    const tl = T(), box = $(el, '.chips'), win = $(el, '.win'), site = $(el, '.site');
    const FILES = ['index.html', 'CNAME', 'event.ics', 'og-image.jpg', 'assets/'];
    box.innerHTML = FILES.map((f, i) => `<div class="file" style="left:220px;top:${260 + i * 124}px;font-size:42px;padding:16px 28px"><svg><use href="#i-${f.endsWith('/') ? 'dir' : 'file'}"/></svg>${f}</div>`).join('');
    const chips = [...box.children];
    tl.set(site, { clipPath: 'inset(0 0 100% 0)' });
    title(tl, $(el, '.t-mask'));
    rise(tl, chips, '<.15');
    rise(tl, win, '<.1');
    tl.step();
    const t1 = tl.duration();
    chips.forEach((c, i) => {
      const dx = 1340 - (220 + c.offsetWidth / 2), dy = 560 - (260 + i * 124 + c.offsetHeight / 2);
      tl.to(c, { x: dx, y: dy, scale: .3, autoAlpha: 0, duration: L, ease: MOVE }, t1 + i * STEP);
    });
    tl.to(win, { x: -380, y: 20, scale: 1.18, transformOrigin: '50% 50%', duration: L, ease: MOVE }, '-=.5');
    tl.to(site, { clipPath: 'inset(0 0 0% 0)', duration: L, ease: MOVE }, '<.3');
    tl.step();
    return { tl };
  },

  /* 17 — GitHub Actions statuses as a left-to-right flow: queued → in progress → success */
  pipeline(el) {
    const tl = T(), box = $(el, '.flow');
    const NODES = [['git push', 'na větev main'], ['GitHub Actions', 'upload-pages-artifact<br>deploy-pages'], ['web je živě', '8a8.gkolin.cz']];
    const icon = `<svg class="status" viewBox="0 0 72 72">
      <circle class="q" cx="36" cy="36" r="26" fill="none" stroke="#7d8590" stroke-width="7"/>
      <g class="p"><circle cx="36" cy="36" r="26" fill="none" stroke="rgba(210,153,34,.3)" stroke-width="7"/><g class="spin"><circle cx="36" cy="36" r="26" fill="none" stroke="#d29922" stroke-width="7" stroke-dasharray="44 120" stroke-linecap="round"/></g></g>
      <g class="ok"><circle cx="36" cy="36" r="32" fill="#5effc4"/><path d="M22 37l9 9 19-20" fill="none" stroke="#0d1117" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
    box.innerHTML = NODES.map(([a, b], i) => `<div class="node" style="position:absolute;left:${220 + i * 540}px;top:300px;width:460px">${icon}<div class="h2" style="margin-top:36px">${a}</div><div class="mono muted sub" style="font-size:36px;margin-top:10px;line-height:1.35">${b}</div></div>`).join('');
    const nodes = [...box.children], st = (r, s) => $(r, '.' + s), lines = [$(el, '.fl1'), $(el, '.fl2')];
    tl.set(nodes.flatMap(r => [st(r, 'p'), st(r, 'ok')]), { autoAlpha: 0 }).set(lines, { drawSVG: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, nodes, '<.15');
    tl.step();
    const run = r => tl.to(st(r, 'q'), { autoAlpha: 0, duration: Q }).to(st(r, 'p'), { autoAlpha: 1, duration: Q }, '<');
    const done = r => tl.to(st(r, 'p'), { autoAlpha: 0, duration: Q }, '+=.6').to(st(r, 'ok'), { autoAlpha: 1, duration: Q }, '<');
    const link = i => tl.to(lines[i], { drawSVG: '100%', stroke: '#5effc4', duration: M, ease: MOVE });
    run(nodes[0]); done(nodes[0]); link(0); run(nodes[1]); tl.step();
    done(nodes[1]); link(1); run(nodes[2]); tl.step();
    done(nodes[2]);
    tl.step();
    return { tl };
  },

  /* 18 — four real steps, lit one per click */
  own(el) {
    const tl = T(), ol = $(el, '.own');
    const ui = t => `<span class="mono" style="font-size:.8em;border:3px solid var(--line);border-radius:12px;padding:2px 18px;white-space:nowrap">${t}</span>`;
    const STEPS = ['Založit účet na github.com', ui('New repository'), `Nahrát ${ui('index.html')}`, `${ui('Settings')} → ${ui('Pages')} → ${ui('Deploy from a branch')}`];
    ol.innerHTML = STEPS.map((s, i) => `<li style="display:flex;gap:40px;align-items:baseline"><span class="num mono h2" style="color:var(--muted);font-size:60px">${i + 1}</span><span class="h2" style="font-weight:400;font-size:60px">${s}</span></li>`).join('');
    const li = [...ol.children];
    title(tl, $(el, '.t-mask'));
    tl.fromTo(li, { autoAlpha: 0, y: RISE }, { autoAlpha: .35, y: 0, duration: M, stagger: STEP }, '<.15');
    rise(tl, $(el, 'p.mono'), '<.2');
    tl.step();
    li.forEach(l => { tl.to(l, { opacity: 1, duration: Q }).to($(l, '.num'), { color: '#5effc4', duration: Q }, '<'); tl.step(); });
    return { tl };
  },

  /* 19 — live demo, then "works on my machine" → ship the machine */
  demo(el) {
    const tl = T(), m = $(el, '.machine');
    title(tl, $(el, '.base .t-mask'));
    rise(tl, $(el, '.base .body'), '<.2');
    tl.step();
    tl.set([$(m, '.q2'), $(m, '.box'), $(m, '.label'), $(m, '.docker')], { autoAlpha: 0 });
    tl.to($(el, '.base'), { autoAlpha: 0, y: -RISE, duration: Q, ease: OUT });
    tl.fromTo(m, { autoAlpha: 0 }, { autoAlpha: 1, duration: Q });
    rise(tl, [$(m, '.q1'), $(m, '.laptop')], '<');
    tl.step();
    tl.to($(m, '.q2'), { autoAlpha: 1, duration: Q }).from($(m, '.q2'), { y: RISE, duration: M }, '<');
    tl.to($(m, '.box'), { autoAlpha: 1, duration: Q }, '<.2').from($(m, '.box'), { y: RISE * 2, duration: M }, '<');
    // packing is the joke's mechanism: laptop drops in, lids close, label goes on
    tl.to($(m, '.laptop'), { y: 170, duration: M, ease: OUT });
    tl.fromTo($(m, '.fl'), { rotation: -100, svgOrigin: '90 200' }, { rotation: 0, svgOrigin: '90 200', duration: Q });
    tl.fromTo($(m, '.fr'), { rotation: 100, svgOrigin: '430 200' }, { rotation: 0, svgOrigin: '430 200', duration: Q }, '<.06');
    tl.to($(m, '.label'), { autoAlpha: 1, duration: Q });
    tl.to($(m, '.docker'), { autoAlpha: 1, duration: Q }, '+=.3').from($(m, '.docker'), { y: RISE, duration: M }, '<');
    tl.step();
    return { tl };
  },

  backup(el) { return { tl: T(), leave() { $(el, 'video').pause(); } }; },

  limits(el) {
    const tl = T();
    rise(tl, [$(el, '.yes h2'), ...$$(el, '.yes li')], 0, { stagger: { amount: .24 } });
    tl.set([$(el, '.no'), $(el, '.lim'), $(el, '.src')], { autoAlpha: 0 }, 0);
    tl.step();
    tl.set($(el, '.no'), { autoAlpha: 1 }, '+=.01');
    rise(tl, [$(el, '.no h2'), ...$$(el, '.no li')], undefined, { stagger: { amount: .18 } });
    tl.step();
    tl.to([$(el, '.lim'), $(el, '.src')], { autoAlpha: 1, duration: Q }).from([$(el, '.lim'), $(el, '.src')], { y: RISE, duration: M }, '<');
    tl.step();
    return { tl };
  },

  /* 21 — Copilot (illustration): a comment becomes a suggestion, Tab accepts it */
  copilot(el) {
    const tl = T(), cm = $(el, '.cm'), sg = $$(el, '.sg'), ghosts = $$(el, '.ghost'), hint = $(el, '.tabhint');
    tl.set([...sg, hint], { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    rise(tl, [$(el, '.chip'), $(el, '.editor')], '<.15');
    tl.step();
    typeInto(tl, cm, '// vrať součet všech čísel v poli');
    tl.step();
    tl.to(sg, { autoAlpha: 1, duration: Q, stagger: STEP }, '+=.3');
    tl.to(hint, { autoAlpha: 1, duration: Q }, '<.1');
    tl.step();
    tl.to(ghosts, { color: '#f0f6fc', fontStyle: 'normal', duration: Q });
    tl.step();
    return { tl };
  },

  /* 22 — Student Pack, then the statement, then zoom out: the deck was a browser tab on github.io */
  reveal(el) {
    const tl = T(), box = $(el, '.tickets'), pack = $(el, '.pack'), stmt = $(el, '.stmt');
    const PERKS = [['GitHub Pro', 'zdarma, dokud studujete'], ['Copilot Student', 'pro ověřené studenty, s limity'], ['Doména', 'na rok zdarma u partnerů']];
    box.innerHTML = PERKS.map(([a, b]) => `<div class="ticket" style="height:440px;border:3px solid var(--mint);border-radius:24px;display:flex;background:var(--surface)">
      <div style="width:56px;border-right:4px dashed var(--muted)"></div>
      <div style="padding:52px 36px;display:flex;flex-direction:column;justify-content:space-between"><div class="h2" style="font-size:56px">${a}</div><div class="small" style="font-size:40px">${b}</div></div></div>`).join('');
    const browser = document.getElementById('browser'), chrome = document.getElementById('chrome'), vp = document.getElementById('viewport'), out = document.getElementById('outside');
    out.innerHTML = `<div style="position:absolute;left:1240px;top:230px;width:520px">
      <div style="background:#fff;border-radius:20px;padding:24px;width:460px;height:460px">${window.QR_SVG ? window.QR_SVG.replace(/width="424" height="424"/, 'width="412" height="412"') : ''}</div>
      <p class="h2" style="margin-top:40px">Naskenujte si ji.</p>
      <p class="mono muted" style="font-size:40px;margin-top:14px;line-height:1.35">marekpasler.github.io/<br>prezentace-github</p></div>`;
    tl.set([out, chrome, stmt], { autoAlpha: 0 });
    title(tl, $(el, '.pack .t-mask'));
    rise(tl, [...box.children, $(el, '.src')], '<.15');
    tl.step();
    tl.to(pack, { autoAlpha: 0, y: -RISE, duration: Q, ease: OUT });
    tl.to(stmt, { autoAlpha: 1, duration: Q }).from(stmt, { y: RISE, duration: M }, '<');
    tl.step();
    tl.to(browser, { scale: .56, x: -320, y: 30, duration: L, ease: MOVE });
    tl.to(chrome, { autoAlpha: 1, duration: M }, '<.3');
    tl.fromTo(vp, { boxShadow: '0 0 0 0px #3d444d' }, { boxShadow: '0 0 0 4px #3d444d', duration: Q }, '<');
    tl.to(out, { autoAlpha: 1, duration: M }, '-=.4').from(out.firstElementChild, { y: RISE, duration: M }, '<');
    tl.step();
    return { tl, leave() { tl.pause(0); } };
  },
};
