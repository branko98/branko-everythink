// Proverava da li stranica na zadatoj širini ima horizontalni skrol.
// Usage: node reference/_tools/overflow-check.mjs [url] [widths...]
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const url = args[0] && !/^\d/.test(args[0]) ? args[0] : 'http://localhost:4321/';
const widths = args.filter(a => /^\d+$/.test(a)).map(Number);
if (widths.length === 0) widths.push(375, 390, 479, 767, 991, 1440);

const b = await chromium.launch();
let anyFail = false;
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  const info = await p.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return {
      inner: window.innerWidth,
      docScroll: html.scrollWidth,
      bodyScroll: body.scrollWidth,
      offenders: (() => {
        const list = [];
        const iw = window.innerWidth;
        const els = document.querySelectorAll('*');
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.right > iw + 0.5 || r.left < -0.5) {
            list.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : '',
              left: Math.round(r.left),
              right: Math.round(r.right),
              w: Math.round(r.width),
            });
          }
          if (list.length >= 5) break;
        }
        return list;
      })(),
    };
  });
  const scrolls = info.docScroll > info.inner;
  const status = scrolls ? 'FAIL' : 'OK';
  if (scrolls) anyFail = true;
  console.log(`  ${status}  ${w}px  inner=${info.inner}  docScroll=${info.docScroll}  bodyScroll=${info.bodyScroll}`);
  if (scrolls) {
    console.log(`         offenders:`);
    for (const o of info.offenders) {
      console.log(`           <${o.tag} class="${o.cls}"> left=${o.left} right=${o.right} w=${o.w}`);
    }
  }
  await ctx.close();
}
await b.close();
process.exit(anyFail ? 1 : 0);
