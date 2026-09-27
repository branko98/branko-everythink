// Renders the hero heading text in Alliance No.1 vs Alliance No.2 (weights 300–600)
// so I can eyeball which matches design.png.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

const FONT_DIR = '/Users/branko/Projects/branko-everythink/public/fonts/alliance';
async function b64(p) { return (await fs.readFile(p)).toString('base64'); }

const [no1_600, no2_600, no1_500, no2_500] = await Promise.all([
  b64(path.join(FONT_DIR, 'alliance-no1-600.otf')),
  b64(path.join(FONT_DIR, 'alliance-no2-600.otf')),
  b64(path.join(FONT_DIR, 'alliance-no1-500.otf')),
  b64(path.join(FONT_DIR, 'alliance-no2-500.otf')),
]);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: AN1; src: url(data:font/otf;base64,${no1_600}) format("opentype"); font-weight: 600; }
@font-face { font-family: AN2; src: url(data:font/otf;base64,${no2_600}) format("opentype"); font-weight: 600; }
@font-face { font-family: AN1m; src: url(data:font/otf;base64,${no1_500}) format("opentype"); font-weight: 500; }
@font-face { font-family: AN2m; src: url(data:font/otf;base64,${no2_500}) format("opentype"); font-weight: 500; }
body { margin:0; padding:20px; background:#fff; }
.row { margin-bottom: 16px; font-size:35.7px; line-height:48px; letter-spacing:-1.2px; color:#000; }
.label { font: 12px -apple-system; color:#777; }
</style></head><body>
<div class="label">Alliance No.1 SemiBold (600)</div>
<div class="row" style="font-family:AN1;font-weight:600">B2B SaaS companies don't have an ads problem.</div>

<div class="label">Alliance No.2 SemiBold (600)</div>
<div class="row" style="font-family:AN2;font-weight:600">B2B SaaS companies don't have an ads problem.</div>

<div class="label">Alliance No.1 Medium (500)</div>
<div class="row" style="font-family:AN1m;font-weight:500">B2B SaaS companies don't have an ads problem.</div>

<div class="label">Alliance No.2 Medium (500)</div>
<div class="row" style="font-family:AN2m;font-weight:500">B2B SaaS companies don't have an ads problem.</div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 800 } });
await p.setContent(html);
await p.waitForTimeout(500);
const box = await p.locator('body').boundingBox();
const out = path.join(ROOT, '_previews', '_font-test.png');
await p.screenshot({ path: out, clip: { x: 0, y: 0, width: Math.ceil(box.width), height: Math.ceil(box.height) } });
console.log('saved', out);
await b.close();
