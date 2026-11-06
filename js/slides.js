/* Slide timelines. Each factory returns { tl, enter?, leave? }; tl.step() marks a click stop (s0, s1, …). */
gsap.registerPlugin(SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin);
gsap.defaults({ ease: 'power3.out', duration: .5 });

const NS = 'http://www.w3.org/2000/svg';
const T = () => { const tl = gsap.timeline({ paused: true }); let k = 0; tl.step = () => tl.addLabel('s' + k++); return tl; };
const $ = (el, q) => el.querySelector(q);
const $$ = (el, q) => [...el.querySelectorAll(q)];
const svg = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.append(n); return n; };
const C = DATA.commits;
const shake = (tl, el, at) => tl.to(el, { x: '+=16', duration: .05, repeat: 7, yoyo: true, ease: 'none' }, at).set(el, { x: 0 });
// meme overlay in, base content out — one shared move so every meme lands the same way
const swapTo = (tl, base, meme) => tl.to(base, { autoAlpha: 0, y: -40, duration: .4, ease: 'power3.in' }).fromTo(meme, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .4 });

window.SLIDES = {
  /* 1 — terminal types git push, screen dissolves into rain, rain assembles the URL */
  cold(el, { REDUCED }) {
    const tl = T();
    const cv = $(el, '.rain'), ctx = cv.getContext('2d');
    const typed = $(el, '.typed'), out = $(el, '.out'), term = $(el, '.term'), url = $(el, '.url-final');
    typed.innerHTML = [...'git push'].map(c => `<span style="display:none">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    // real output of the last push of the ball website
    out.innerHTML = ['To github.com:marekpasler/plesoktava.git', '   d414374..4060246  main -> main'].map(l => `<div style="display:none">${l}</div>`).join('');
    const R = { rain: 0, conv: 0 };

    // particles: sample the URL glyphs so the rain can land exactly on the letters
    const GLY = '01アイウエオカキクケコサシスセソ<>/{}=+*#$git';
    const off = document.createElement('canvas'); off.width = 1920; off.height = 1080;
    const o = off.getContext('2d');
    o.font = '600 150px "Plex Mono"'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff';
    o.fillText('8a8.gkolin.cz', 960, 548);
    const px = o.getImageData(0, 0, 1920, 1080).data, P = [];
    for (let y = 0; y < 1080; y += 9) for (let x = 0; x < 1920; x += 9) if (px[(y * 1920 + x) * 4 + 3] > 140)
      P.push({ tx: x, ty: y, sx: Math.round(Math.random() * 68) * 28 + 8, sy: Math.random() * 1080, d: Math.random() * .45, g: GLY[Math.random() * GLY.length | 0] });
    const COLS = 69, drops = Array.from({ length: COLS }, () => Math.random() * -40), on = Array.from({ length: COLS }, Math.random);

    let raf = 0, last = 0;
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const frame = now => {
      raf = requestAnimationFrame(frame);
      if (now - last < 45) return; last = now; // ~22 fps reads as "digital rain", not smooth scroll
      ctx.fillStyle = 'rgba(13,17,23,.16)'; ctx.fillRect(0, 0, 1920, 1080);
      const live = R.rain * (1 - R.conv);
      ctx.font = '24px "Plex Mono"';
      for (let i = 0; i < COLS; i++) {
        if (on[i] > live) continue;
        const y = drops[i] * 28;
        ctx.fillStyle = '#d7fff0'; ctx.fillText(GLY[Math.random() * GLY.length | 0], i * 28 + 8, y);
        ctx.fillStyle = '#5effc4'; ctx.fillText(GLY[Math.random() * GLY.length | 0], i * 28 + 8, y - 28);
        drops[i] = y > 1080 && Math.random() > .96 ? 0 : drops[i] + 1;
      }
      if (R.conv > 0) {
        ctx.font = '600 13px "Plex Mono"'; ctx.fillStyle = '#5effc4';
        for (const p of P) {
          const t = ease(Math.min(1, Math.max(0, (R.conv - p.d) / (1 - .45))));
          if (t < 1 && Math.random() < .2) p.g = GLY[Math.random() * GLY.length | 0];
          ctx.fillText(p.g, p.sx + (p.tx - p.sx) * t, p.sy + (p.ty - p.sy) * t);
        }
      }
    };

    tl.set(url, { autoAlpha: 0 }).set(cv, { autoAlpha: 1 });
    tl.step(); // s0: black screen, blinking caret
    $$(typed, 'span').forEach(c => tl.set(c, { display: 'inline' }, '+=.11'));
    tl.to({}, { duration: .35 });
    $$(out, 'div').forEach(l => tl.set(l, { display: 'block' }, '+=.28'));
    tl.to(term, { autoAlpha: 0, duration: .25 }, '+=.5');
    tl.to(R, { rain: 1, duration: .8, ease: 'none' }, '<');
    tl.to(R, { conv: 1, duration: 2.4, ease: 'none' }, '+=1.4');
    tl.to(url, { autoAlpha: 1, duration: .6 }, '-=.3');
    tl.to(cv, { autoAlpha: 0, duration: .8 }, '<');
    tl.step(); // s1

    return {
      tl, loop: true,
      enter() { if (!REDUCED && !raf) raf = requestAnimationFrame(frame); },
      leave() { cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, 1920, 1080); },
    };
  },

  /* 2 — final_final.zip, then the pills meme */
  zips(el) {
    const tl = T();
    const files = $$(el, '.file'), last = $(el, '.file.last'), meme = $(el, '.pills');
    tl.from(files, { y: -900, autoAlpha: 0, duration: 1, ease: 'bounce.out', stagger: .45 });
    shake(tl, last, '+=.1');
    tl.step();
    swapTo(tl, $(el, '.files'), meme);
    tl.from($(meme, 'h2'), { y: 30, autoAlpha: 0 }, '<');
    tl.from($$(meme, '.pill'), { scale: .5, autoAlpha: 0, transformOrigin: '50% 30%', stagger: .18, ease: 'back.out(1.6)' }, '<.1');
    tl.step();
    tl.to($(meme, '.pill.blue'), { opacity: .25, duration: .4 });
    tl.to($(meme, '.pill.red'), { scale: 1.08, filter: 'drop-shadow(0 0 36px rgba(255,123,114,.85))', transformOrigin: '50% 30%', duration: .5 }, '<');
    tl.step();
    return { tl };
  },

  /* 3 — Git = camera, GitHub = album; then expanding brain */
  gitvs(el) {
    const tl = T();
    const album = $(el, '.album'), photo = $(el, '.photo'), flash = $(el, '.flash');
    album.innerHTML = Array.from({ length: 8 }, (_, i) => `<div style="height:130px;border-radius:8px;border:3px ${i === 7 ? 'dashed var(--muted)' : 'solid var(--line)'};background:${i === 7 ? 'transparent' : 'var(--surface)'}"></div>`).join('');
    const cols = $$(el, '.cols > div:not(.album):not(.photo):not(.flash)');
    tl.from(cols, { y: 40, autoAlpha: 0, stagger: .15 });
    tl.from(album.children, { autoAlpha: 0, scale: .8, stagger: .04, duration: .3 }, '<.2');
    tl.step();
    tl.fromTo(flash, { opacity: 0 }, { opacity: .85, duration: .06, ease: 'none' })
      .to(flash, { opacity: 0, duration: .35 })
      .fromTo(photo, { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, '<')
      .to(photo, { motionPath: { path: [{ x: 700, y: -220 }, { x: 1410, y: 150 }], curviness: 1.2 }, rotation: 360, duration: 1.1, ease: 'power2.inOut' }, '+=.2')
      .to(album.children[7], { borderColor: 'var(--ink)', duration: .2 }, '-=.15');
    tl.step();

    // expanding brain — four rows, each brighter
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
      tl.from(r, { autoAlpha: 0, x: -40, duration: .45 });
      tl.from($(r, 'svg'), { scale: .6, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, '<');
    });
    tl.step();
    return { tl };
  },

  /* 4 — real file tree of the ball website, folders unfold one by one, then .git */
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
    // .git/ is the first child of the project folder (hidden until the last click)
    const gitLines = [['├── ', '.git/'], ['│   ├── ', 'HEAD'], ['│   ├── ', 'objects/'], ['│   └── ', 'refs/']];
    box.innerHTML =
      `<div class="ln" style="height:${LH}px;line-height:${LH}px;white-space:pre;font-weight:600">plesoktava/</div>` +
      gitLines.map(([p, n]) => `<div class="ln git" style="height:${LH}px;line-height:${LH}px;overflow:hidden;white-space:pre"><span class="muted">${p}</span><span class="mint" style="font-weight:600">${n}</span>${n === '.git/' ? '<span class="mint" style="font-family:var(--sans)">   ← tady je ta paměť</span>' : ''}</div>`).join('') +
      lines.map(l => `<div class="ln" data-path="${l.path}" data-depth="${l.depth}" style="height:${LH}px;line-height:${LH}px;overflow:hidden;white-space:pre"><span class="muted">${l.text}</span><span style="color:${l.dir ? 'var(--mint)' : 'var(--ink)'}">${l.name}</span></div>`).join('');
    const sel = f => $$(box, '.ln[data-path]').filter(n => f(n.dataset.path, +n.dataset.depth));
    const top = sel((p, d) => d === 0), assets = sel(p => /^assets\/[^/]+$/.test(p)), img = sel(p => /^assets\/img\/./.test(p));
    const collapsed = [...$$(box, '.ln.git'), ...sel((p, d) => d > 0)];
    tl.set(collapsed, { height: 0, autoAlpha: 0 });
    tl.from(box.children[0], { autoAlpha: 0, x: -20, duration: .3 });
    tl.from(top, { autoAlpha: 0, x: -20, stagger: .07, duration: .3 });
    tl.step();
    const unfold = group => tl.to(group, { height: LH, autoAlpha: 1, stagger: .09, duration: .35 });
    unfold(assets); tl.step();
    unfold(img); tl.step();
    unfold($$(box, '.ln.git')); tl.step();
    return { tl };
  },

  /* 5 — real one-line diff of commit 9cc712d */
  commit(el) {
    const tl = T();
    const del = $(el, '.row.del'), add = $(el, '.row.add'), stamp = $(el, '.stamp'), hash = $(el, '.hash'), snap = $(el, '.snap');
    tl.set(add, { x: 1700, y: -90 }).set([stamp, snap], { autoAlpha: 0 });
    tl.from($(el, '.diff'), { y: 30, autoAlpha: 0 });
    tl.step();
    tl.to(del, { x: -1700, duration: .6, ease: 'power3.in' });
    tl.to(add, { x: 0, duration: .6 }, '-=.15');
    tl.step();
    tl.fromTo(stamp, { scale: 1.3, autoAlpha: 0, transformOrigin: '0% 50%' }, { scale: 1, autoAlpha: 1, duration: .35, ease: 'back.out(2.5)' });
    tl.to(hash, { scrambleText: { text: '9cc712d', chars: '0123456789abcdef', revealDelay: .3, speed: .8 }, duration: 1 }, '<');
    tl.step();
    tl.to(add, { y: 0, duration: .5 }).to(del, { x: 0, duration: .5 }, '<.1');
    tl.to(snap, { autoAlpha: 1, y: 0, duration: .5 }, '<.2');
    tl.step();
    return { tl };
  },

  /* 6 — git log as a timeline; three real stories; the "Update index.html" meme */
  history(el) {
    const tl = T(), s = $(el, '.tl'), notes = $(el, '.notes');
    // x = real time; bursts keep a minimum gap so they read as a cluster, not one blob
    const ts = C.map(c => +new Date(c.date)), t0 = ts[0], t1 = ts[ts.length - 1], xs = [];
    ts.forEach((t, i) => { const raw = 220 + (t - t0) / (t1 - t0) * 1560; xs.push(i ? Math.max(raw, xs[i - 1] + 9) : raw); });
    const k = 1560 / (xs[xs.length - 1] - 220);
    const X = i => 220 + (xs[i] - 220) * k, Y = 600;
    const base = svg('path', { d: `M220 ${Y} H1780`, stroke: '#3d444d', 'stroke-width': 6, fill: 'none' }, s);
    const dots = C.map((c, i) => svg('circle', { cx: X(i), cy: Y, r: Math.min(22, 7 + Math.sqrt(c.add + c.del) * .45), fill: '#1e5c47', stroke: '#5effc4', 'stroke-width': 3 }, s));
    const days = {};
    C.forEach((c, i) => { const d = new Date(c.date); const key = `${d.getDate()}. ${d.getMonth() + 1}.`; if (!(key in days)) days[key] = i; });
    const ticks = ['7. 10.', '14. 10.', '26. 10.', '6. 11.'].map(k => { const t = svg('text', { x: X(days[k]), y: Y + 90, 'text-anchor': 'middle', fill: '#b7c0ca', 'font-family': 'Plex Mono', 'font-size': 40 }, s); t.textContent = k; return t; });
    const idx = h => C.findIndex(c => c.short === h);
    const STORIES = [
      { at: [idx('6a92b55')], x: 220, y: 250, when: '7. 10. 21:10', what: `první commit: celý web, ${C[0].add} řádků` },
      { at: [idx('ccc1664'), idx('ec31a86'), idx('87a9e0a')], x: X(idx('ccc1664')) - 40, y: 740, when: '13. 10. 14:00–14:02', what: 'Create CNAME, Delete CNAME, Create CNAME' },
      { at: [idx('b63730d')], x: 1000, y: 250, when: '14. 10. 23:05', what: 'oprava v noci: © 2027 → 2026' },
    ];
    const counter = $(el, '.n');
    tl.set(counter, { textContent: 0 });
    tl.from(base, { drawSVG: 0, duration: 1.2, ease: 'power2.inOut' });
    tl.to(counter, { textContent: C.length, snap: { textContent: 1 }, duration: 1.2, ease: 'power2.inOut' }, '<');
    tl.from(dots, { scale: 0, transformOrigin: '50% 50%', stagger: 1.1 / C.length, duration: .3, ease: 'back.out(3)' }, '<.05');
    tl.from(ticks, { autoAlpha: 0, duration: .3 }, '-=.3');
    tl.step();
    STORIES.forEach(st => {
      const n = document.createElement('div');
      n.style.cssText = `position:absolute;left:${st.x}px;top:${st.y}px`;
      n.innerHTML = `<div class="mono mint" style="font-size:36px">${st.when}</div><div style="font-size:46px;margin-top:8px;font-weight:600">${st.what}</div>`;
      notes.append(n);
      const leads = st.at.map(i => svg('path', { d: `M${X(i)} ${Y + (st.y < Y ? -26 : 26)} L${st.x + 20} ${st.y < Y ? st.y + 120 : st.y - 16}`, stroke: '#5effc4', 'stroke-width': 3, fill: 'none' }, s));
      tl.to(st.at.map(i => dots[i]), { scale: 1.7, fill: '#5effc4', transformOrigin: '50% 50%', duration: .4, ease: 'back.out(3)', stagger: .12 });
      tl.from(leads, { drawSVG: 0, duration: .4 }, '<.1');
      tl.from(n, { autoAlpha: 0, y: st.y < Y ? 20 : -20, duration: .4 }, '<.2');
      tl.step();
    });
    // meme: the honest commit messages
    const meme = $(el, '.log'), term = $(meme, '.term');
    const upd = C.filter(c => c.message === 'Update index.html');
    term.innerHTML = `<div><span class="prompt">$ </span>git log --oneline --grep="Update index.html"</div>` +
      upd.slice().reverse().map(c => `<div class="l"><span style="color:var(--amber)">${c.short}</span> Update index.html</div>`).join('');
    $(meme, '.count').textContent = `${upd.length} ze ${C.length}`;
    tl.fromTo(meme, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 });
    const ls = $$(term, '.l');
    tl.from(ls, { autoAlpha: 0, duration: .01, stagger: .07 });
    shake(tl, ls[ls.length - 1], '+=.1');
    tl.from($(meme, '.count'), { scale: 0, transformOrigin: '50% 50%', ease: 'back.out(2)', duration: .4 });
    tl.step();
    return { tl };
  },

  /* 7 — metro map: HEAD rides the branch, merge has two parents, then a conflict */
  branch(el) {
    const tl = T(), q = c => $(el, c);
    const head = q('.headptr'), stAfter = $(el, '.st-after circle'), stMain = $$(el, '.st-main circle'), stBr = $$(el, '.st-br circle');
    gsap.set([...stMain, stAfter], { attr: { fill: '#0d1117', stroke: '#b7c0ca', 'stroke-width': 10 } });
    gsap.set(stBr, { attr: { fill: '#0d1117', stroke: '#5effc4', 'stroke-width': 10 } });
    tl.set(head, { x: 760, y: 680 });
    tl.from(q('.main'), { drawSVG: 0, duration: 1, ease: 'power2.inOut' });
    tl.from(stMain, { scale: 0, transformOrigin: '50% 50%', stagger: .12, duration: .3, ease: 'back.out(3)' }, '<.2');
    tl.from([q('.lb-main'), head], { autoAlpha: 0, duration: .3 });
    tl.set([q('.out'), q('.in')], { drawSVG: 0 }, 0).set([...stBr, stAfter, q('.st-merge'), q('.lb-br'), q('.lb-merge')], { autoAlpha: 0 }, 0);
    tl.step();
    tl.to(q('.lb-br'), { autoAlpha: 1, duration: .3 });
    tl.to(q('.out'), { drawSVG: '100%', duration: 1.6, ease: 'power1.inOut' }, '<');
    tl.to(head, { motionPath: { path: '#br-out' }, duration: 1.6, ease: 'power1.inOut' }, '<');
    stBr.forEach((c, i) => tl.fromTo(c, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(3)' }, `<${i ? .22 : .9}`));
    tl.step();
    tl.to(q('.in'), { drawSVG: '100%', duration: 1, ease: 'power1.inOut' });
    tl.to(head, { motionPath: { path: '#br-in' }, duration: 1, ease: 'power1.inOut' }, '<');
    tl.fromTo(q('.st-merge'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(3)' }, '-=.15');
    tl.to(q('.lb-merge'), { autoAlpha: 1, duration: .3 });
    tl.fromTo(stAfter, { scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(3)', immediateRender: false });
    tl.step();
    const meme = q('.conflict');
    tl.fromTo(meme, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 });
    tl.from($$(meme, '.term > div'), { autoAlpha: 0, x: -30, stagger: .12, duration: .3 });
    tl.to($$(meme, '.mk'), { opacity: .15, repeat: 5, yoyo: true, duration: .16, ease: 'none' });
    tl.step();
    return { tl };
  },

  /* 8 — Octoverse numbers + a counter that lives while the slide is up */
  numbers(el) {
    const tl = T(), cs = $$(el, '.c'), tick = $(el, '.t');
    tl.set(cs, { textContent: 0 });
    cs.forEach((c, i) => tl.to(c, { textContent: +c.dataset.to, snap: { textContent: 1 }, duration: 1.6, ease: 'power3.out' }, i * .15));
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

  /* 9 — files leave the repo and become the website */
  pages(el) {
    const tl = T(), box = $(el, '.chips'), win = $(el, '.win'), site = $(el, '.site');
    const FILES = ['index.html', 'CNAME', 'event.ics', 'og-image.jpg', 'assets/'];
    box.innerHTML = FILES.map((f, i) => `<div class="file" style="left:220px;top:${260 + i * 124}px;font-size:42px;padding:16px 28px"><svg><use href="#i-${f.endsWith('/') ? 'dir' : 'file'}"/></svg>${f}</div>`).join('');
    const chips = [...box.children];
    tl.set(site, { clipPath: 'inset(0 0 100% 0)' });
    tl.from(chips, { autoAlpha: 0, x: -40, stagger: .08 });
    tl.from(win, { autoAlpha: 0, scale: .96, transformOrigin: '50% 50%' }, '<.2');
    tl.step();
    chips.forEach((c, i) => {
      const dx = 1340 - (220 + c.offsetWidth / 2), dy = 610 - (260 + i * 124 + c.offsetHeight / 2);
      tl.to(c, { x: dx, y: dy, scale: .25, autoAlpha: 0, duration: .7, ease: 'power3.in' }, i * .09 + .001 + tl.labels.s0);
    });
    tl.to(win, { x: -380, y: 40, scale: 1.18, transformOrigin: '50% 50%', duration: .9, ease: 'power3.inOut' }, '-=.1');
    tl.to(site, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power2.inOut' }, '<.3');
    tl.step();
    return { tl };
  },

  /* 10 — GitHub Actions statuses: queued → in progress → success */
  pipeline(el) {
    const tl = T(), box = $(el, '.steps');
    const ROWS = [['git push', 'na větev main'], ['GitHub Actions sestaví web', 'upload-pages-artifact → deploy-pages'], ['web je živě', 'https://8a8.gkolin.cz']];
    const icon = `<svg class="status" viewBox="0 0 72 72">
      <circle class="q" cx="36" cy="36" r="26" fill="none" stroke="#7d8590" stroke-width="7"/>
      <g class="p"><circle cx="36" cy="36" r="26" fill="none" stroke="rgba(210,153,34,.3)" stroke-width="7"/><g class="spin"><circle cx="36" cy="36" r="26" fill="none" stroke="#d29922" stroke-width="7" stroke-dasharray="44 120" stroke-linecap="round"/></g></g>
      <g class="ok"><circle cx="36" cy="36" r="32" fill="#5effc4"/><path d="M22 37l9 9 19-20" fill="none" stroke="#0d1117" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
    box.innerHTML = ROWS.map(([a, b]) => `<div class="row" style="display:flex;gap:44px;align-items:center">${icon}<div><div class="h2">${a}</div><div class="mono muted sub" style="font-size:40px;margin-top:6px">${b}</div></div></div>`).join('');
    const rows = [...box.children];
    const st = (r, s) => ({ q: $(r, '.q'), p: $(r, '.p'), ok: $(r, '.ok') })[s];
    tl.set(rows.flatMap(r => [st(r, 'p'), st(r, 'ok')]), { autoAlpha: 0 });
    tl.set($(rows[2], '.sub'), { autoAlpha: 0 });
    tl.from(rows, { autoAlpha: 0, x: -30, stagger: .12 });
    tl.step();
    const run = r => tl.set(st(r, 'q'), { autoAlpha: 0 }).set(st(r, 'p'), { autoAlpha: 1 });
    const done = r => tl.set(st(r, 'p'), { autoAlpha: 0 }, '+=.7').fromTo(st(r, 'ok'), { autoAlpha: 0, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(3)' });
    run(rows[0]); done(rows[0]); run(rows[1]); tl.step();
    done(rows[1]); run(rows[2]); tl.step();
    done(rows[2]);
    tl.to($(rows[2], '.sub'), { autoAlpha: 1, scrambleText: { text: 'https://8a8.gkolin.cz', chars: 'lowerCase', speed: .6 }, duration: .8 });
    tl.step();
    return { tl };
  },

  /* 11 — four real steps, lit one per click */
  own(el) {
    const tl = T(), ol = $(el, '.own');
    const ui = t => `<span class="mono" style="font-size:.8em;border:3px solid var(--line);border-radius:12px;padding:2px 18px;white-space:nowrap">${t}</span>`;
    const STEPS = ['Založ si účet na github.com', ui('New repository'), `Nahraj ${ui('index.html')}`, `${ui('Settings')} → ${ui('Pages')} → ${ui('Deploy from branch')}`];
    ol.innerHTML = STEPS.map((s, i) => `<li style="display:flex;gap:40px;align-items:baseline"><span class="num mono h2" style="color:var(--muted);font-size:64px">${i + 1}</span><span class="h2" style="font-weight:400;font-size:64px">${s}</span></li>`).join('');
    const li = [...ol.children];
    tl.from(li, { autoAlpha: 0, y: 20, stagger: .08 });
    tl.to(li, { opacity: .3, duration: .3 }, '<');
    tl.step();
    li.forEach(l => { tl.to(l, { opacity: 1, x: 12, duration: .35 }).to($(l, '.num'), { color: '#5effc4', duration: .35 }, '<'); tl.step(); });
    return { tl };
  },

  demo(el) {
    const tl = T();
    tl.from($$(el, '.base > *'), { autoAlpha: 0, y: 40, stagger: .15 });
    tl.step();
    swapTo(tl, $(el, '.base'), $(el, '.machine'));
    tl.step();
    return { tl };
  },

  backup(el) { return { tl: T(), leave() { const v = $(el, 'video'); v.pause(); } }; },

  limits(el) {
    const tl = T();
    tl.from([$(el, '.yes h2'), ...$$(el, '.yes li')], { autoAlpha: 0, x: -30, stagger: .1 });
    tl.from($(el, '.no'), { autoAlpha: 0, duration: .01 }, 0);
    tl.step();
    tl.from([$(el, '.no h2'), ...$$(el, '.no li')], { autoAlpha: 0, x: -30, stagger: .1 });
    tl.step();
    return { tl };
  },

  /* 14 — three perks flip like tickets */
  student(el) {
    const tl = T(), box = $(el, '.tickets');
    const PERKS = [['GitHub Pro', 'placený účet zdarma'], ['Copilot', 'zdarma pro studenty'], ['Doména', 'na rok zdarma']];
    box.innerHTML = PERKS.map(([a, b]) => `<div class="ticket" style="height:440px;border:3px solid var(--mint);border-radius:24px;display:flex;background:var(--surface);backface-visibility:hidden">
      <div style="width:56px;border-right:4px dashed var(--muted)"></div>
      <div style="padding:56px 40px;display:flex;flex-direction:column;justify-content:space-between"><div class="h2" style="font-size:64px;white-space:nowrap">${a}</div><div class="small" style="font-size:42px">${b}</div></div></div>`).join('');
    tl.from(box.children, { rotationY: -100, autoAlpha: 0, transformOrigin: '0% 50%', stagger: .25, duration: .8, ease: 'power3.out' });
    tl.step();
    return { tl };
  },

  more(el) {
    const tl = T();
    tl.from($$(el, '.it'), { autoAlpha: 0, y: 40, stagger: .15 });
    tl.step();
    return { tl };
  },

  /* 16 — zoom out: the whole deck was a browser tab on github.io */
  reveal(el) {
    const tl = T();
    const browser = document.getElementById('browser'), chrome = document.getElementById('chrome'), vp = document.getElementById('viewport'), out = document.getElementById('outside');
    out.innerHTML = `<div style="position:absolute;left:1270px;top:250px;width:560px">
      <div style="background:#fff;border-radius:20px;padding:28px;width:480px;height:480px">${window.QR_SVG || ''}</div>
      <p class="h2" style="margin-top:44px">Naskenuj si ji.</p>
      <p class="mono muted" style="font-size:40px;margin-top:16px;line-height:1.35">marekpasler.github.io/<br>prezentace-github</p></div>`;
    const split = SplitText.create($(el, 'p'), { type: 'words' });
    tl.from(split.words, { autoAlpha: 0, y: 30, stagger: .06 });
    tl.set(out, { autoAlpha: 0 }, 0).set(chrome, { autoAlpha: 0 }, 0);
    tl.step();
    tl.to(browser, { scale: .56, x: -360, y: 40, duration: 1.6, ease: 'power3.inOut' });
    tl.to(chrome, { autoAlpha: 1, duration: .6 }, '<.3');
    tl.fromTo(vp, { boxShadow: '0 0 0 0px #3d444d' }, { boxShadow: '0 0 0 4px #3d444d', duration: .6 }, '<');
    tl.to(out, { autoAlpha: 1, duration: .6 }, '-=.5');
    tl.from(out.firstElementChild, { x: 60, duration: .8 }, '<');
    tl.step();
    return { tl, leave() { tl.pause(0); } };
  },
};
