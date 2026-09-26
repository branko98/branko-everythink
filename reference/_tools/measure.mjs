// Measure box positions on live for a list of selectors.
// Usage: node reference/_tools/measure.mjs <url> <selector> [selector...]
import { chromium } from 'playwright';
const [url, ...selectors] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
const results = {};
for (const sel of selectors) {
  const loc = p.locator(sel).first();
  const box = await loc.boundingBox().catch(() => null);
  results[sel] = box;
}
console.log(JSON.stringify(results, null, 2));
await b.close();
