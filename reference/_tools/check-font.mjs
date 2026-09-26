import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(process.argv[2] || 'http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
const sel = process.argv[3] || 'h1.hero-h1';
const info = await p.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { error: 'not found: ' + sel };
  const cs = getComputedStyle(el);
  return {
    selector: sel,
    text: (el.textContent || '').slice(0, 60),
    fontFamily: cs.fontFamily,
    fontWeight: cs.fontWeight,
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    color: cs.color,
    loadedFonts: [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style} ${f.status}`),
  };
}, sel);
console.log(JSON.stringify(info, null, 2));
await b.close();
