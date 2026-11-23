// Film strips of chosen steps: a frame every 120 ms while the step animates.
// Usage: node tools/strip.cjs <puppeteer-core dir> <chrome exe> <out dir> slide:step [slide:step …]
const [, , PPT, CHROME, OUT, ...targets] = process.argv;
const puppeteer = require(PPT);
const fs = require('fs'), path = require('path');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5180/#1', { waitUntil: 'networkidle0' });
  await sleep(600);
  for (const t of targets) {
    const [id, k] = t.split(':');
    // land on the step before, settled, then click once and film it
    await page.evaluate((id, k) => {
      const el = DECK.order.find(s => s.dataset.id === id);
      DECK.show(DECK.order[0], { instant: true });
      DECK.show(el, { instant: true });
    }, id, +k);
    for (let i = 0; i < +k - 1; i++) { await page.evaluate(() => DECK.next()); await sleep(2600); }
    await sleep(400);
    await page.evaluate(() => DECK.next());
    for (let f = 0; f < 14; f++) {
      await page.screenshot({ path: path.join(OUT, `${id}-${k}-${String(f).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 });
      await sleep(120);
    }
  }
  await browser.close();
  console.log('ok');
})().catch(e => { console.error(e); process.exit(1); });
