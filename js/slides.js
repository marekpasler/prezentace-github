/* Slide timelines. Each factory returns { tl, enter?, leave?, onStep?, loop? }; tl.step() marks a click stop (s0, s1, …).
   Motion system (one personality for the whole deck):
     enter  = expo.out, 0.55–0.8 s, from below      exit = power2.in, 0.3 s
     titles = word-by-word mask reveal                stagger budget < 0.5 s
     emphasis = back.out pop, shake only for errors   ambient = dot grid drift (deck.js) */
gsap.registerPlugin(SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin);
gsap.defaults({ ease: 'expo.out', duration: .55 });

const NS = 'http://www.w3.org/2000/svg';
const T = () => { const tl = gsap.timeline({ paused: true }); let k = 0; tl.step = () => tl.addLabel('s' + k++); return tl; };
const $ = (el, q) => el.querySelector(q);
const $$ = (el, q) => [...el.querySelectorAll(q)];
const svg = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.append(n); return n; };
const C = DATA.commits;
const shake = (tl, el, at, amp = 16) => tl.to(el, { x: `+=${amp}`, duration: .05, repeat: 7, yoyo: true, ease: 'none' }, at).set(el, { x: 0 });
// meme overlay in, base content out — one shared move so every meme lands the same way
const swapTo = (tl, base, meme) => tl
  .to(base, { autoAlpha: 0, y: -24, duration: .3, ease: 'power2.in' })
  .fromTo(meme, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .55 });
// the deck's title signature: words rise out of a line mask
const title = (tl, nodes, at = 0) => {
  [].concat(nodes).filter(Boolean).forEach((n, i) => {
    const sp = SplitText.create(n, { type: 'lines,words', mask: 'lines', linesClass: 'tl', wordsClass: 'tw' });
    tl.from(sp.words, { yPercent: 115, duration: .8, stagger: .045 }, i ? '<.1' : at);
  });
};
// type a string into an element one character per tick (seek-safe: display toggles revert on rewind)
const typeInto = (tl, el, text, cps = .055, at) => {
  el.innerHTML = [...text].map(c => `<span style="display:none">${c === ' ' ? '&nbsp;' : c.replace('<', '&lt;')}</span>`).join('');
  $$(el, 'span').forEach((s, i) => tl.set(s, { display: 'inline' }, i === 0 && at !== undefined ? at : `+=${cps}`));
};
// video slides: s0 = poster frame, s1 = the film plays to its end and holds
const film = (el, seconds, auto = false) => {
  const tl = T(), v = $(el, 'video');
  if (!auto) tl.step();
  tl.to({}, { duration: seconds });
  tl.step();
  const playStep = auto ? 0 : 1;
  const at = (k, instant) => {
    if (k < playStep) { v.pause(); v.currentTime = 0; return; }
    if (instant) { v.pause(); v.currentTime = Math.max(0, (v.duration || seconds) - .05); return; }
    v.currentTime = 0; v.play().catch(() => {});
  };
  return { tl, onStep: at, enter() { v.pause(); v.currentTime = 0; }, leave() { v.pause(); } };
};

window.SLIDES = {
  /* 1 — HyperFrames film: terminal push, digital rain, the URL */
  cold(el) { return film(el, 8.5); },

  /* 2 — final_final.zip, then the pills meme */
  zips(el) {
    const tl = T();
    const files = $$(el, '.file'), last = $(el, '.file.last'), meme = $(el, '.pills'), side = $(el, '.side');
    tl.from(files, { y: -900, autoAlpha: 0, duration: 1, ease: 'bounce.out', stagger: .4 });
    shake(tl, last, '+=.05');
    tl.from(side, { autoAlpha: 0, x: 40 }, '-=.1');
    tl.step();
    swapTo(tl, $(el, '.files'), meme);
    title(tl, $(meme, 'h2'), '<');
    tl.from($$(meme, '.pill'), { y: 60, autoAlpha: 0, stagger: .14, duration: .7 }, '<.15');
    tl.step();
    tl.to($(meme, '.pill.blue'), { opacity: .2, duration: .35, ease: 'power2.out' });
    tl.to($(meme, '.pill.red .cap'), { scale: 1.1, rotation: -6, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.5)' }, '<');
    tl.to($(meme, '.pill.red'), { filter: 'drop-shadow(0 0 40px rgba(255,123,114,.9))', duration: .5 }, '<');
    tl.step();
    return { tl };
  },

  /* 3 — Remotion film: 2005 → 2025 */
  story(el) { return film(el, 15.5, true); },

  /* 4 — Git = camera, GitHub = album; then expanding brain */
  gitvs(el) {
    const tl = T();
    const album = $(el, '.album'), photo = $(el, '.photo'), flash = $(el, '.flash');
    album.innerHTML = Array.from({ length: 8 }, (_, i) => `<div style="height:130px;border-radius:8px;border:3px ${i === 7 ? 'dashed var(--muted)' : 'solid var(--line)'};background:${i === 7 ? 'transparent' : 'var(--surface)'}"></div>`).join('');
    title(tl, $$(el, '.col .t-mask'));
    tl.from($$(el, '.col .body'), { autoAlpha: 0, y: 24, stagger: .1 }, '<.3');
    tl.from(album.children, { autoAlpha: 0, y: 20, stagger: .035, duration: .4 }, '<.1');
    tl.step();
    tl.fromTo(flash, { opacity: 0 }, { opacity: .85, duration: .06, ease: 'none' })
      .to(flash, { opacity: 0, duration: .35, ease: 'power2.out' })
      .fromTo(photo, { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, '<')
      .to(photo, { motionPath: { path: [{ x: 700, y: -220 }, { x: 1410, y: 150 }], curviness: 1.2 }, rotation: 360, duration: 1.1, ease: 'power2.inOut' }, '+=.15')
      .to(album.children[7], { borderColor: '#f0f6fc', borderStyle: 'solid', duration: .2 }, '-=.15');
    tl.step();

    const rows = $(el, '.brain-rows');
    const STAGES = [['poslat web mailem jako .zip', 0, '#7d8590'], ['Google Disk', 6, '#1e9e74'], ['GitHub', 18, '#5effc4'], ['GitHub Pages', 48, '#d7fff0']];
    const brain = `<svg viewBox="0 0 200 140" style="width:220px;height:154px;flex:none"><path d="M100 18c-10-10-34-12-46 2-16-2-30 10-30 26-14 6-18 26-6 38-4 18 10 34 28 32 8 12 30 14 42 4 2-2 10-2 12 0 12 10 34 8 42-4 18 2 32-14 28-32 12-12 8-32-6-38 0-16-14-28-30-26-12-14-36-12-46-2z M100 18v112 M56 50c10 4 14 14 10 24 M144 50c-10 4-14 14-10 24 M44 92c12-2 22 4 24 14 M156 92c-12-2-22 4-24 14" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    rows.innerHTML = STAGES.map(([t]) => `<div class="br-row" style="display:flex;align-items:center;justify-content:space-between;height:200px;border-bottom:2px solid var(--line)"><span class="h2" style="font-weight:600">${t}</span>${brain}</div>`).join('');
    swapTo(tl, $(el, '.cols'), $(el, '.brain'));
    $$(rows, '.br-row').forEach((r, i) => {
      const [, glow, col] = STAGES[i];
      gsap.set($(r, 'path'), { stroke: col });
      if (glow) gsap.set($(r, 'svg'), { filter: `drop-shadow(0 0 ${glow}px ${col})` });
      if (i) tl.step();
      tl.from(r, { autoAlpha: 0, x: -40, duration: .5 });
      tl.from($(r, 'svg'), { scale: .8, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.5)' }, '<');
    });
    tl.step();
    return { tl };
  },

  /* 5 — real file tree; folders unfold; .git is the memory */
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
      lines.map(l => row('', `data-path="${l.path}" data-depth="${l.depth}"`, `<span class="muted">${l.text}</span><span style="color:${l.dir ? 'var(--mint)' : 'var(--ink)'}">${l.name}</span>`)).join('');
    const sel = f => $$(box, '.ln[data-path]').filter(n => f(n.dataset.path, +n.dataset.depth));
    const top = sel((p, d) => d === 0), assets = sel(p => /^assets\/[^/]+$/.test(p)), img = sel(p => /^assets\/img\/./.test(p));
    tl.set([...$$(box, '.ln.git'), ...sel((p, d) => d > 0)], { height: 0, autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    tl.from($(el, '.body'), { autoAlpha: 0, y: 24 }, '<.3');
    tl.from([$(box, '.root'), ...top], { autoAlpha: 0, x: -24, stagger: .04, duration: .4 }, '<');
    tl.step();
    const unfold = group => tl.to(group, { height: LH, autoAlpha: 1, stagger: .06, duration: .4, ease: 'power3.out' });
    unfold(assets); tl.step();
    unfold(img); tl.step();
    unfold($$(box, '.ln.git')); tl.step();
    return { tl };
  },

  /* 6 — real one-line diff of commit 9cc712d */
  commit(el) {
    const tl = T();
    const del = $(el, '.row.del'), add = $(el, '.row.add'), stamp = $(el, '.stamp'), hash = $(el, '.hash'), snap = $(el, '.snap');
    tl.set(add, { x: 1700, y: -90 }).set([stamp, snap], { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    tl.from($(el, '.diff'), { y: 40, autoAlpha: 0 }, '<.2');
    tl.step();
    tl.to(del, { x: -1700, duration: .5, ease: 'power3.in' });
    tl.to(add, { x: 0, duration: .7 }, '-=.15');
    tl.step();
    tl.fromTo(stamp, { scale: 1.35, autoAlpha: 0, transformOrigin: '0% 50%' }, { scale: 1, autoAlpha: 1, duration: .35, ease: 'back.out(2.5)' });
    tl.to(hash, { scrambleText: { text: '9cc712d', chars: '0123456789abcdef', revealDelay: .3, speed: .8 }, duration: 1, ease: 'none' }, '<');
    tl.step();
    tl.to(add, { y: 0, duration: .6 }).to(del, { x: 0, duration: .6 }, '<.1');
    tl.to(snap, { autoAlpha: 1, duration: .5 }, '<.2').from(snap, { y: 24, duration: .5 }, '<');
    tl.step();
    return { tl };
  },

  /* 7 — git log on a real time axis; three stories; the honest commit messages */
  history(el) {
    const tl = T(), s = $(el, '.tl'), notes = $(el, '.notes');
    const ts = C.map(c => +new Date(c.date)), t0 = ts[0], t1 = ts[ts.length - 1], xs = [];
    ts.forEach((t, i) => { const raw = 220 + (t - t0) / (t1 - t0) * 1560; xs.push(i ? Math.max(raw, xs[i - 1] + 9) : raw); });
    const kx = 1560 / (xs[xs.length - 1] - 220);
    const X = i => 220 + (xs[i] - 220) * kx, Y = 600;
    const base = svg('path', { d: `M220 ${Y} H1780`, stroke: '#3d444d', 'stroke-width': 6, fill: 'none' }, s);
    const dots = C.map((c, i) => svg('circle', { cx: X(i), cy: Y, r: Math.min(22, 7 + Math.sqrt(c.add + c.del) * .45), fill: '#1e5c47', stroke: '#5effc4', 'stroke-width': 3 }, s));
    const days = {};
    C.forEach((c, i) => { const d = new Date(c.date); const key = `${d.getDate()}. ${d.getMonth() + 1}.`; if (!(key in days)) days[key] = i; });
    const ticks = ['7. 10.', '26. 10.', '6. 11.'].map(k => { const t = svg('text', { x: X(days[k]), y: Y + 90, 'text-anchor': 'middle', fill: '#b7c0ca', 'font-family': 'Plex Mono', 'font-size': 40 }, s); t.textContent = k; return t; });
    const idx = h => C.findIndex(c => c.short === h);
    const STORIES = [
      { at: [idx('6a92b55')], x: 220, y: 250, when: '7. 10. 21:10', what: `první commit: celý web, ${C[0].add} řádků` },
      { at: [idx('ccc1664'), idx('ec31a86'), idx('87a9e0a')], x: X(idx('ccc1664')) - 40, y: 740, when: '13. 10. 14:00–14:02', what: 'Create CNAME, Delete CNAME, Create CNAME' },
      { at: [idx('b63730d')], x: 1220, y: 250, when: '14. 10. 23:05', what: 'oprava v noci: © 2027 → 2026' },
    ];
    const counter = $(el, '.n');
    tl.set(counter, { textContent: 0 });
    tl.from(base, { drawSVG: 0, duration: 1.2, ease: 'power2.inOut' });
    tl.to(counter, { textContent: C.length, snap: { textContent: 1 }, duration: 1.2, ease: 'power2.inOut' }, '<');
    tl.from(dots, { scale: .2, autoAlpha: 0, transformOrigin: '50% 50%', stagger: { amount: .9 }, duration: .35, ease: 'back.out(3)' }, '<.05');
    tl.from(ticks, { autoAlpha: 0, y: 10, duration: .4 }, '-=.3');
    tl.step();
    STORIES.forEach(st => {
      const n = document.createElement('div');
      n.style.cssText = `position:absolute;left:${st.x}px;top:${st.y}px`;
      n.innerHTML = `<div class="mono mint" style="font-size:40px">${st.when}</div><div style="font-size:48px;margin-top:8px;font-weight:600">${st.what}</div>`;
      notes.append(n);
      const leads = st.at.map(i => svg('path', { d: `M${X(i)} ${Y + (st.y < Y ? -26 : 26)} L${st.x + 20} ${st.y < Y ? st.y + 130 : st.y - 16}`, stroke: '#5effc4', 'stroke-width': 3, fill: 'none' }, s));
      tl.to(st.at.map(i => dots[i]), { scale: 1.7, fill: '#5effc4', transformOrigin: '50% 50%', duration: .4, ease: 'back.out(3)', stagger: .1 });
      tl.from(leads, { drawSVG: 0, duration: .45, ease: 'power2.out' }, '<.1');
      tl.from(n, { autoAlpha: 0, y: st.y < Y ? 24 : -24, duration: .55 }, '<.15');
      tl.step();
    });
    const meme = $(el, '.log'), term = $(meme, '.term');
    const upd = C.filter(c => c.message === 'Update index.html');
    term.innerHTML = `<div><span class="prompt">$ </span>git log --oneline --grep="Update index.html"</div>` +
      upd.slice().reverse().map(c => `<div class="l"><span style="color:var(--amber)">${c.short}</span> Update index.html</div>`).join('');
    $(meme, '.count').textContent = `${upd.length} ze ${C.length}`;
    tl.fromTo(meme, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, ease: 'power2.out' });
    const ls = $$(term, '.l');
    tl.from(ls, { autoAlpha: 0, duration: .01, stagger: .06 });
    shake(tl, ls[ls.length - 1], '+=.1');
    tl.from($(meme, '.count'), { scale: .6, autoAlpha: 0, transformOrigin: '50% 50%', ease: 'back.out(2.5)', duration: .45 });
    tl.step();
    return { tl };
  },

  /* 8 — git blame: every line points at the presenter */
  blame(el) {
    const tl = T(), box = $(el, '.blame');
    const BL = [ // real `git blame -L 410,416 index.html` of the ball website, code trimmed to fit
      ['8f3de972', '29.10. 14:34', '<p class="price">370,-</p>'],
      ['8f3de972', '29.10. 14:34', '<h2 id="ticketTitle">Vstupné'],
      ['40602465', '06.11. 17:49', '<!-- Stav prodeje je i v příkazu…'],
      ['d4143743', '06.11. 17:09', '<strong>Zbývají poslední lístky.'],
      ['d4143743', '06.11. 17:09', 'Kup si ho v naší třídě P02…'],
      ['d4143743', '06.11. 17:09', 'Platba QR kódem nebo hotově.'],
    ];
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    box.innerHTML = `<div><span class="prompt">$ </span>git blame index.html</div>` + BL.map(([h, d, code]) =>
      `<div class="bl" style="white-space:pre"><span style="color:var(--amber)">${h}</span> (<span class="who">marekpasler</span> <span class="muted">${d}</span>) ${esc(code)}</div>`).join('');
    const verdict = $(el, '.verdict');
    title(tl, $(el, '.t-mask'));
    tl.from(box.firstElementChild, { autoAlpha: 0, x: -20, duration: .4 }, '<.3');
    tl.from($$(box, '.bl'), { autoAlpha: 0, x: -20, stagger: .06, duration: .4 }, '+=.15');
    tl.step();
    tl.to($$(box, '.who'), { color: '#0d1117', backgroundColor: '#5effc4', duration: .2, stagger: .08, ease: 'power2.out' });
    tl.fromTo(verdict, { autoAlpha: 0, scale: .85, transformOrigin: '0% 50%' }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2.2)' }, '+=.1');
    tl.step();
    return { tl };
  },

  /* 9 — metro map; HEAD rides the branch; then two lines collide into a conflict */
  branch(el) {
    const tl = T(), q = c => $(el, c);
    const head = q('.headptr'), stAfter = q('.st-after circle'), stMain = $$(el, '.st-main circle'), stBr = $$(el, '.st-br circle');
    gsap.set([...stMain, stAfter], { attr: { fill: '#0d1117', stroke: '#b7c0ca', 'stroke-width': 10 } });
    gsap.set(stBr, { attr: { fill: '#0d1117', stroke: '#5effc4', 'stroke-width': 10 } });
    tl.set(head, { x: 760, y: 680 });
    tl.set([q('.out'), q('.in')], { drawSVG: 0 }).set([...stBr, stAfter, q('.st-merge'), q('.lb-br'), q('.lb-merge')], { autoAlpha: 0 });
    title(tl, q('.t-mask'));
    tl.from(q('.main'), { drawSVG: 0, duration: 1, ease: 'power2.inOut' }, '<.1');
    tl.from(stMain, { scale: .3, autoAlpha: 0, transformOrigin: '50% 50%', stagger: .12, duration: .35, ease: 'back.out(3)' }, '<.2');
    tl.from([q('.lb-main'), head], { autoAlpha: 0, duration: .35 });
    tl.step();
    tl.to(q('.lb-br'), { autoAlpha: 1, duration: .3 });
    tl.to(q('.out'), { drawSVG: '100%', duration: 1.5, ease: 'power1.inOut' }, '<');
    tl.to(head, { motionPath: { path: '#br-out' }, duration: 1.5, ease: 'power1.inOut' }, '<');
    stBr.forEach((c, i) => tl.fromTo(c, { autoAlpha: 0, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(3)' }, `<${i ? .22 : .85}`));
    tl.step();
    tl.to(q('.in'), { drawSVG: '100%', duration: 1, ease: 'power1.inOut' });
    tl.to(head, { motionPath: { path: '#br-in' }, duration: 1, ease: 'power1.inOut' }, '<');
    tl.fromTo(q('.st-merge'), { autoAlpha: 0, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(3)' }, '-=.15');
    tl.to(q('.lb-merge'), { autoAlpha: 1, duration: .3 });
    tl.fromTo(stAfter, { scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(3)', immediateRender: false });
    tl.step();
    // conflict: the two edits of the same line fly in and collide
    const meme = q('.conflict'), a = $(meme, '.ln.a'), b = $(meme, '.ln.b'), mks = $$(meme, '.mk'), boom = $(meme, '.boom'), cf = $(meme, '.cf');
    tl.fromTo(meme, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'power2.out' });
    tl.set(mks, { autoAlpha: 0 }, '<');
    title(tl, $(meme, 'h2'), '<');
    tl.fromTo(a, { x: -1700, y: 74 }, { x: 0, y: 74, duration: .55, ease: 'power3.in' }, '<.2');
    tl.fromTo(b, { x: 1700, y: -73 }, { x: 0, y: -73, duration: .55, ease: 'power3.in' }, '<');
    tl.fromTo(boom, { scale: .5, autoAlpha: 1 }, { scale: 9, autoAlpha: 0, duration: .5, ease: 'power2.out' });
    shake(tl, cf, '<', 22);
    tl.to(a, { y: 0, duration: .55, ease: 'back.out(2)' }, '-=.1');
    tl.to(b, { y: 0, duration: .55, ease: 'back.out(2)' }, '<');
    tl.to(mks, { autoAlpha: 1, duration: .25, stagger: .08, ease: 'power2.out' }, '<.2');
    tl.to(mks, { opacity: .2, repeat: 3, yoyo: true, duration: .16, ease: 'none' });
    tl.step();
    return { tl };
  },

  /* 10 — a pull request: checks run, a review lands, merge */
  pr(el) {
    const tl = T(), card = $(el, '.prcard'), chk = $(el, '.chk'), rev = $(el, '.rev'), btn = $(el, '.pr-btn'), state = $(el, '.pr-state');
    tl.set($(chk, '.ok'), { autoAlpha: 0 }).set(rev, { autoAlpha: 0 }).set(btn, { opacity: .35 });
    title(tl, $(el, '.t-mask'));
    tl.from(card, { y: 60, autoAlpha: 0, duration: .8 }, '<.15');
    tl.step();
    tl.set($(chk, '.p'), { autoAlpha: 0 }, '+=.5');
    tl.fromTo($(chk, '.ok'), { autoAlpha: 0, scale: .6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(3)' });
    tl.to(rev, { autoAlpha: 1, duration: .4 }, '+=.2').from(rev, { x: -30, duration: .5 }, '<');
    tl.from($(rev, '.avatar'), { scale: .5, duration: .45, ease: 'back.out(3)' }, '<');
    tl.to(btn, { opacity: 1, duration: .3, ease: 'power2.out' });
    tl.step();
    tl.to(btn, { scale: .95, duration: .08, ease: 'power2.in' }).to(btn, { scale: 1, duration: .3, ease: 'back.out(3)' });
    tl.set(state, { className: 'pr-state merged' }).set($(state, '.o'), { display: 'none' }, '<').set($(state, '.m'), { display: 'inline' }, '<');
    tl.from(state, { scale: 1.25, duration: .45, ease: 'back.out(2.5)' }, '<');
    tl.to(btn, { autoAlpha: .35, duration: .3 }, '<');
    tl.step();
    return { tl };
  },

  /* 11 — open source: star it, fork it, send a PR back */
  fork(el) {
    const tl = T(), a = $(el, '.rc-a'), b = $(el, '.rc-b'), star = $(el, '.star'), cnt = $(el, '.cnt'), fcnt = $(el, '.fcnt');
    tl.set([b, $(el, '.fork-pr')], { autoAlpha: 0 }).set([$(el, '.fa1'), $(el, '.fa2')], { drawSVG: 0 });
    title(tl, $(el, '.t-mask'));
    tl.from(a, { y: 50, autoAlpha: 0, duration: .8 }, '<.15');
    tl.step();
    tl.to(star, { scale: 1.15, duration: .12, ease: 'power2.out' }).to(star, { scale: 1, duration: .4, ease: 'back.out(3)' });
    tl.set(star, { className: 'rc-btn star on' }, '<').set(cnt, { textContent: '1' }, '<');
    tl.step();
    tl.set(fcnt, { textContent: '1' });
    tl.to(b, { autoAlpha: 1, duration: .2 }, '<');
    tl.from(b, { x: -680, y: -320, scale: .92, duration: .9, ease: 'power3.inOut' }, '<');
    tl.to($(el, '.fa1'), { drawSVG: '100%', duration: .5, ease: 'power2.out' }, '-=.35');
    tl.step();
    tl.to($(el, '.fa2'), { drawSVG: '100%', duration: .9, ease: 'power2.inOut' });
    tl.to($(el, '.fork-pr'), { autoAlpha: 1, duration: .4 }, '-=.3').from($(el, '.fork-pr'), { y: 16, duration: .5 }, '<');
    tl.step();
    return { tl };
  },

  /* 12 — Octoverse numbers + a counter that lives while the slide is up */
  numbers(el) {
    const tl = T(), cs = $$(el, '.c'), tick = $(el, '.t');
    tl.set(cs, { textContent: 0 });
    tl.from($$(el, '.display'), { yPercent: 40, autoAlpha: 0, stagger: .1, duration: .8 });
    cs.forEach((c, i) => tl.to(c, { textContent: +c.dataset.to, snap: { textContent: 1 }, duration: 1.6, ease: 'power3.out' }, i * .1));
    tl.from($(el, '.tick'), { autoAlpha: 0, y: 30 }, '-=.6');
    tl.step();
    let iv = 0, t0 = 0;
    return {
      tl, loop: true,
      // Octoverse 2025: one new developer every second
      enter(resume) {
        if (!resume) t0 = Date.now();
        const lbl = $(el, '.tl-lbl');
        const upd = () => { const n = Math.floor((Date.now() - t0) / 1000); tick.textContent = n; lbl.textContent = n === 1 ? 'nový vývojář' : n >= 2 && n <= 4 ? 'noví vývojáři' : 'nových vývojářů'; };
        upd(); clearInterval(iv); iv = setInterval(upd, 250);
      },
      leave() { clearInterval(iv); },
    };
  },

  /* 13 — files leave the repo and become the website */
  pages(el) {
    const tl = T(), box = $(el, '.chips'), win = $(el, '.win'), site = $(el, '.site');
    const FILES = ['index.html', 'CNAME', 'event.ics', 'og-image.jpg', 'assets/'];
    box.innerHTML = FILES.map((f, i) => `<div class="file" style="left:220px;top:${260 + i * 124}px;font-size:42px;padding:16px 28px"><svg><use href="#i-${f.endsWith('/') ? 'dir' : 'file'}"/></svg>${f}</div>`).join('');
    const chips = [...box.children];
    tl.set(site, { clipPath: 'inset(0 0 100% 0)' });
    title(tl, $(el, '.t-mask'));
    tl.from(chips, { autoAlpha: 0, x: -40, stagger: .07 }, '<.15');
    tl.from(win, { autoAlpha: 0, y: 40, duration: .8 }, '<.1');
    tl.step();
    const t1 = tl.duration();
    chips.forEach((c, i) => {
      const dx = 1340 - (220 + c.offsetWidth / 2), dy = 610 - (260 + i * 124 + c.offsetHeight / 2);
      tl.to(c, { x: dx, y: dy, scale: .25, autoAlpha: 0, duration: .65, ease: 'power3.in' }, t1 + i * .08);
    });
    tl.to(win, { x: -380, y: 40, scale: 1.18, transformOrigin: '50% 50%', duration: .9, ease: 'power3.inOut' }, '-=.1');
    tl.to(site, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power2.inOut' }, '<.3');
    tl.step();
    return { tl };
  },

  /* 14 — GitHub Actions statuses: queued → in progress → success */
  pipeline(el) {
    const tl = T(), box = $(el, '.steps');
    const ROWS = [['git push', 'na větev main'], ['GitHub Actions sestaví web', 'upload-pages-artifact → deploy-pages'], ['web je živě', 'https://8a8.gkolin.cz']];
    const icon = `<svg class="status" viewBox="0 0 72 72">
      <circle class="q" cx="36" cy="36" r="26" fill="none" stroke="#7d8590" stroke-width="7"/>
      <g class="p"><circle cx="36" cy="36" r="26" fill="none" stroke="rgba(210,153,34,.3)" stroke-width="7"/><g class="spin"><circle cx="36" cy="36" r="26" fill="none" stroke="#d29922" stroke-width="7" stroke-dasharray="44 120" stroke-linecap="round"/></g></g>
      <g class="ok"><circle cx="36" cy="36" r="32" fill="#5effc4"/><path d="M22 37l9 9 19-20" fill="none" stroke="#0d1117" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
    box.innerHTML = ROWS.map(([a, b]) => `<div class="row" style="display:flex;gap:44px;align-items:center">${icon}<div><div class="h2">${a}</div><div class="mono muted sub" style="font-size:40px;margin-top:6px">${b}</div></div></div>`).join('');
    const rows = [...box.children];
    const st = (r, s) => $(r, '.' + s);
    tl.set(rows.flatMap(r => [st(r, 'p'), st(r, 'ok')]), { autoAlpha: 0 });
    tl.set($(rows[2], '.sub'), { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    tl.from(rows, { autoAlpha: 0, x: -30, stagger: .1 }, '<.15');
    tl.step();
    const run = r => tl.set(st(r, 'q'), { autoAlpha: 0 }).set(st(r, 'p'), { autoAlpha: 1 });
    const done = r => tl.set(st(r, 'p'), { autoAlpha: 0 }, '+=.7').fromTo(st(r, 'ok'), { autoAlpha: 0, scale: .6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(3)' });
    run(rows[0]); done(rows[0]); run(rows[1]); tl.step();
    done(rows[1]); run(rows[2]); tl.step();
    done(rows[2]);
    tl.to($(rows[2], '.sub'), { autoAlpha: 1, scrambleText: { text: 'https://8a8.gkolin.cz', chars: 'lowerCase', speed: .6 }, duration: .8, ease: 'none' });
    tl.step();
    return { tl };
  },

  /* 15 — four real steps, lit one per click */
  own(el) {
    const tl = T(), ol = $(el, '.own');
    const ui = t => `<span class="mono" style="font-size:.8em;border:3px solid var(--line);border-radius:12px;padding:2px 18px;white-space:nowrap">${t}</span>`;
    const STEPS = ['Založ si účet na github.com', ui('New repository'), `Nahraj ${ui('index.html')}`, `${ui('Settings')} → ${ui('Pages')} → ${ui('Deploy from branch')}`];
    ol.innerHTML = STEPS.map((s, i) => `<li style="display:flex;gap:40px;align-items:baseline"><span class="num mono h2" style="color:var(--muted);font-size:64px">${i + 1}</span><span class="h2" style="font-weight:400;font-size:64px">${s}</span></li>`).join('');
    const li = [...ol.children];
    title(tl, $(el, '.t-mask'));
    tl.fromTo(li, { autoAlpha: 0, y: 20 }, { autoAlpha: .3, y: 0, stagger: .07 }, '<.15');
    tl.step();
    li.forEach(l => { tl.to(l, { opacity: 1, x: 12, duration: .4 }).to($(l, '.num'), { color: '#5effc4', duration: .4 }, '<'); tl.step(); });
    return { tl };
  },

  /* 16 — live demo, then "works on my machine" → ship the machine */
  demo(el) {
    const tl = T(), m = $(el, '.machine');
    title(tl, $(el, '.base .t-mask'));
    tl.from($(el, '.base .body'), { autoAlpha: 0, y: 24 }, '<.3');
    tl.step();
    tl.set([$(m, '.q2'), $(m, '.box'), $(m, '.label'), $(m, '.docker')], { autoAlpha: 0 });
    swapTo(tl, $(el, '.base'), m);
    tl.from($(m, '.q1'), { y: 40, autoAlpha: 0, duration: .7 }, '<');
    tl.from($(m, '.laptop'), { y: -60, autoAlpha: 0, duration: .7 }, '<.2');
    tl.step();
    tl.to($(m, '.q2'), { autoAlpha: 1, duration: .3 }).from($(m, '.q2'), { y: 40, duration: .7 }, '<');
    tl.fromTo($(m, '.box'), { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: .5 }, '<.3');
    tl.to($(m, '.laptop'), { y: 170, duration: .45, ease: 'power3.in' });
    tl.fromTo($(m, '.fl'), { rotation: -100, svgOrigin: '90 200' }, { rotation: 0, svgOrigin: '90 200', duration: .35, ease: 'power3.out' });
    tl.fromTo($(m, '.fr'), { rotation: 100, svgOrigin: '430 200' }, { rotation: 0, svgOrigin: '430 200', duration: .35, ease: 'power3.out' }, '<.08');
    tl.fromTo($(m, '.label'), { autoAlpha: 0, scale: 1.5, rotation: -8, svgOrigin: '260 305' }, { autoAlpha: 1, scale: 1, rotation: -4, svgOrigin: '260 305', duration: .35, ease: 'back.out(2.5)' });
    tl.to($(m, '.docker'), { autoAlpha: 1, duration: .5 }, '+=.3');
    tl.step();
    return { tl };
  },

  backup(el) { return { tl: T(), leave() { $(el, 'video').pause(); } }; },

  /* 17 — Friday 16:59 + git push --force */
  friday(el) {
    const tl = T(), typed = $(el, '.typed'), alarm = $(el, '.alarm'), down = $(el, '.fr-down'), toasts = $(el, '.toasts'), calm = $(el, '.fr-calm');
    const TOASTS = [['#ples · Slack', 'PRODUKCE NEJEDE!!!'], ['Mamka', 'Proč nejde web plesu?'], ['GitHub', 'přepsaná historie main']];
    toasts.innerHTML = TOASTS.map(([a, b]) => `<div class="toast"><b>${a}</b>${b}</div>`).join('');
    tl.set([down, $(el, '.fr-fix')], { autoAlpha: 0 }).set(toasts.children, { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    tl.from($(el, '.term'), { autoAlpha: 0, y: 24 }, '<.3');
    tl.step();
    typeInto(tl, typed, 'git push --force origin main', .05);
    tl.to({}, { duration: .3 });
    tl.step();
    tl.to(alarm, { opacity: .45, duration: .12, repeat: 5, yoyo: true, ease: 'none' });
    shake(tl, calm, '<', 20);
    tl.fromTo(down, { autoAlpha: 0, scale: 1.4, transformOrigin: '0% 50%' }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)' }, '<.2');
    tl.fromTo(toasts.children, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: .5, stagger: .25 }, '<.2');
    tl.step();
    tl.to([down, toasts], { autoAlpha: .25, duration: .4, ease: 'power2.out' });
    tl.to($(el, '.fr-fix'), { autoAlpha: 1, duration: .4 }, '<').from($$(el, '.fr-fix p'), { y: 24, stagger: .1, duration: .6 }, '<');
    tl.step();
    return { tl };
  },

  limits(el) {
    const tl = T();
    tl.from([$(el, '.yes h2'), ...$$(el, '.yes li')], { autoAlpha: 0, x: -30, stagger: .08 });
    tl.set($(el, '.no'), { autoAlpha: 0 }, 0);
    tl.step();
    tl.set($(el, '.no'), { autoAlpha: 1 });
    tl.from([$(el, '.no h2'), ...$$(el, '.no li')], { autoAlpha: 0, x: -30, stagger: .08 });
    tl.step();
    return { tl };
  },

  /* 19 — Copilot's honest suggestion */
  copilot(el) {
    const tl = T(), cm = $(el, '.cm'), ghost = $(el, '.ghost'), hint = $(el, '.tabhint');
    tl.set([ghost, hint], { autoAlpha: 0 });
    title(tl, $(el, '.t-mask'));
    tl.from($(el, '.editor'), { y: 50, autoAlpha: 0, duration: .8 }, '<.15');
    tl.step();
    typeInto(tl, cm, '// napiš mi celou maturitní práci', .045);
    tl.step();
    tl.to(ghost, { autoAlpha: 1, duration: .5, ease: 'power2.out' }, '+=.35');
    tl.to(hint, { autoAlpha: 1, duration: .4 }, '<.2');
    tl.step();
    tl.set(ghost, { className: 'ghost accepted' });
    tl.from(ghost, { x: 10, duration: .3 }, '<');
    tl.to(hint, { autoAlpha: 0, duration: .3 }, '<');
    tl.step();
    return { tl };
  },

  /* 20 — three perks flip like tickets */
  student(el) {
    const tl = T(), box = $(el, '.tickets');
    const PERKS = [['GitHub Pro', 'placený účet zdarma'], ['Copilot', 'zdarma pro studenty'], ['Doména', 'na rok zdarma']];
    box.innerHTML = PERKS.map(([a, b]) => `<div class="ticket" style="height:440px;border:3px solid var(--mint);border-radius:24px;display:flex;background:var(--surface);backface-visibility:hidden">
      <div style="width:56px;border-right:4px dashed var(--muted)"></div>
      <div style="padding:56px 40px;display:flex;flex-direction:column;justify-content:space-between"><div class="h2" style="font-size:64px;white-space:nowrap">${a}</div><div class="small" style="font-size:42px">${b}</div></div></div>`).join('');
    title(tl, $(el, '.t-mask'));
    tl.from(box.children, { rotationY: -100, autoAlpha: 0, transformOrigin: '0% 50%', stagger: .15, duration: .9, ease: 'power3.out' }, '<.15');
    tl.step();
    return { tl };
  },

  /* 21 — zoom out: the whole deck was a browser tab on github.io */
  reveal(el) {
    const tl = T();
    const browser = document.getElementById('browser'), chrome = document.getElementById('chrome'), vp = document.getElementById('viewport'), out = document.getElementById('outside');
    out.innerHTML = `<div style="position:absolute;left:1270px;top:250px;width:560px">
      <div style="background:#fff;border-radius:20px;padding:28px;width:480px;height:480px">${window.QR_SVG || ''}</div>
      <p class="h2" style="margin-top:44px">Naskenuj si ji.</p>
      <p class="mono muted" style="font-size:40px;margin-top:16px;line-height:1.35">marekpasler.github.io/<br>prezentace-github</p></div>`;
    tl.set(out, { autoAlpha: 0 }).set(chrome, { autoAlpha: 0 });
    title(tl, $(el, 'p'));
    tl.step();
    tl.to(browser, { scale: .56, x: -360, y: 40, duration: 1.6, ease: 'expo.inOut' });
    tl.to(chrome, { autoAlpha: 1, duration: .6, ease: 'power2.out' }, '<.4');
    tl.fromTo(vp, { boxShadow: '0 0 0 0px #3d444d' }, { boxShadow: '0 0 0 4px #3d444d', duration: .6 }, '<');
    tl.to(out, { autoAlpha: 1, duration: .6 }, '-=.5');
    tl.from(out.firstElementChild, { x: 60, duration: .9 }, '<');
    tl.step();
    return { tl, leave() { tl.pause(0); } };
  },
};
