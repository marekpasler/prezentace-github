// Headless QA: every slide, every click step, forward and back.
// Usage: node tools/qa.cjs <puppeteer-core dir> <chrome exe> <out dir> [url]
const [, , PPT, CHROME, OUT, URL = 'http://localhost:5180/'] = process.argv;
const puppeteer = require(PPT);
const fs = require('fs'), path = require('path');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--enable-gpu-rasterization'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(URL + '#1', { waitUntil: 'networkidle0' });
  await sleep(800);

  // wait until the current step's tween (and the slide entrance) has finished
  const settle = async () => { for (let i = 0; i < 200; i++) { if (!(await page.evaluate(() => DECK.state.playing))) break; await sleep(50); } await sleep(1000); };
  // frame pacing during an animation: count frames slower than 50 ms
  const startProbe = () => page.evaluate(() => { window.__fr = []; let last = performance.now(); const f = t => { window.__fr.push(t - last); last = t; if (window.__probe) requestAnimationFrame(f); }; window.__probe = true; requestAnimationFrame(f); });
  const stopProbe = () => page.evaluate(() => { window.__probe = false; const a = window.__fr.slice(2); return { frames: a.length, long: a.filter(x => x > 50).length, worst: Math.round(Math.max(0, ...a)) }; });

  const n = await page.evaluate(() => DECK.order.length);
  const fwd = {}, report = [], crops = [];
  await page.evaluate(() => DECK.show(DECK.order[0], { instant: true }));
  for (let guard = 0; guard < 200; guard++) {
    const st = await page.evaluate(() => DECK.state);
    const key = `${st.slide}-${st.step}`;
    if (!fwd[key]) {
      const file = path.join(OUT, `f-${String(Object.keys(fwd).length).padStart(3, '0')}-${key}.png`);
      await page.screenshot({ path: file });
      fwd[key] = file;
      // crop check: visible leaf elements must sit inside the 90% action-safe zone of the 1920×1080 stage
      const out = await page.evaluate(() => {
        const shell = document.getElementById('shell').getBoundingClientRect(), k = shell.width / 1920;
        const SAFE = { l: 96, t: 54, r: 1824, b: 1026 };
        const root = document.querySelector('.slide.active');
        const els = [...root.querySelectorAll('*'), ...document.querySelectorAll('#outside *, #rail circle, #rail-head, #chrome .dots i')];
        const shown = el => { for (let n = el; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .05) return false; } return true; };
        const leaf = el => el instanceof SVGGraphicsElement && !(el instanceof SVGSVGElement) || ['IMG', 'VIDEO', 'CANVAS'].includes(el.tagName) || (el.children.length === 0 && el.textContent.trim());
        return els.filter(el => leaf(el) && !el.closest('video.film') && shown(el)).map(el => {
          const r = el.getBoundingClientRect();
          const b = { l: (r.left - shell.left) / k, t: (r.top - shell.top) / k, r: (r.right - shell.left) / k, b: (r.bottom - shell.top) / k };
          if (b.r - b.l < 2 || b.b - b.t < 2) return null;
          const off = b.l < 0 || b.t < 0 || b.r > 1920 || b.b > 1080, unsafe = b.l < SAFE.l || b.t < SAFE.t || b.r > SAFE.r || b.b > SAFE.b;
          if (!unsafe) return null;
          const name = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || el.tagName.toLowerCase();
          return `${off ? 'OFF' : 'unsafe'} ${name}${el.textContent.trim() ? ` "${el.textContent.trim().slice(0, 30)}"` : ''} [${b.l | 0},${b.t | 0} → ${b.r | 0},${b.b | 0}]`;
        }).filter(Boolean);
      });
      if (out.length) crops.push({ key, out });
    }
    if (st.slide === 'reveal' && st.last) break;
    await startProbe();
    await page.evaluate(() => DECK.next());
    await settle();
    // films play in real time; give them their length before measuring the next step
    const film = await page.evaluate(() => { const v = document.querySelector('.slide.active video:not([controls])'); return v && !v.paused ? v.duration - v.currentTime : 0; });
    if (film > 0) await sleep(film * 1000 + 300);
    const p = await stopProbe();
    const now = await page.evaluate(() => DECK.state);
    report.push({ from: key, to: `${now.slide}-${now.step}`, ...p });
  }

  // back: every step should look like it did on the way forward
  const diffs = [];
  for (let guard = 0; guard < 200; guard++) {
    await page.evaluate(() => DECK.prev());
    await sleep(250);
    const st = await page.evaluate(() => DECK.state);
    const key = `${st.slide}-${st.step}`;
    const back = path.join(OUT, `b-${key}.png`);
    await page.screenshot({ path: back });
    if (fwd[key]) diffs.push({ key, back, fwd: fwd[key] });
    if (st.slide === 'cold' && st.step === 0) break;
  }

  // pixel diff in the page itself (no extra deps)
  const cmp = await browser.newPage();
  await cmp.goto('about:blank');
  const results = [];
  for (const d of diffs) {
    const a = fs.readFileSync(d.fwd).toString('base64'), b = fs.readFileSync(d.back).toString('base64');
    const pct = await cmp.evaluate(async (a, b) => {
      const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
      const [A, B] = await Promise.all([load(a), load(b)]);
      const w = 480, h = 270, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
      x.drawImage(A, 0, 0, w, h); const pa = x.getImageData(0, 0, w, h).data;
      x.clearRect(0, 0, w, h); x.drawImage(B, 0, 0, w, h); const pb = x.getImageData(0, 0, w, h).data;
      let diff = 0; for (let i = 0; i < pa.length; i += 4) if (Math.abs(pa[i] - pb[i]) + Math.abs(pa[i + 1] - pb[i + 1]) + Math.abs(pa[i + 2] - pb[i + 2]) > 60) diff++;
      return +(100 * diff / (w * h)).toFixed(2);
    }, a, b);
    results.push({ key: d.key, diffPct: pct });
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ slides: n, errors, steps: report, backVsForward: results, crops }, null, 1));
  console.log('slides', n, 'steps', report.length, 'errors', errors.length);
  console.log('janky steps:', report.filter(r => r.long > 2).map(r => `${r.from}→${r.to} long=${r.long} worst=${r.worst}ms`).join(' | ') || 'none');
  console.log('back≠forward (>1.5%):', results.filter(r => r.diffPct > 1.5).map(r => `${r.key} ${r.diffPct}%`).join(' | ') || 'none');
  console.log("crops (outside 90% safe zone):", crops.length ? "\n" + crops.map(c => c.key + "\n  " + c.out.join("\n  ")).join("\n") : "none");
  if (errors.length) console.log('errors:', errors.slice(0, 8).join('\n'));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
