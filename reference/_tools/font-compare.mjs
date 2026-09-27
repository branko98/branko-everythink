// Renders the design heading crop next to Alliance No.1/No.2 at 35.7 px.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

const FONT_DIR = '/Users/branko/Projects/branko-everythink/public/fonts/alliance';
async function b64(p) { return (await fs.readFile(p)).toString('base64'); }
const [no1_600, no2_600] = await Promise.all([
  b64(path.join(FONT_DIR, 'alliance-no1-600.otf')),
  b64(path.join(FONT_DIR, 'alliance-no2-600.otf')),
]);

// design heading, cropped and scaled ×0.5 to live
const designPng = (await fs.readFile(path.join(ROOT, '_previews', '_design-line1.png'))).toString('base64');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: AN1; src: url(data:font/otf;base64,${no1_600}) format("opentype"); font-weight:600; }
@font-face { font-family: AN2; src: url(data:font/otf;base64,${no2_600}) format("opentype"); font-weight:600; }
body { margin:0; padding:20px; background:#fff; }
.label { font: 12px -apple-system; color:#555; margin-top: 20px; }
.row { font-size:35.7px; line-height:48px; letter-spacing:-1.2px; color:#000; }
img.design { display:block; }
</style></head><body>
<p class="label">design.png (line 1, ×0.5 → live scale)</p>
<img class="design" src="data:image/png;base64,${designPng}">

<p class="label">Alliance No.1 SemiBold (600) — 35.7 / 48 / -1.2</p>
<div class="row" style="font-family:AN1">B2B SaaS companies don't have an ads problem.</div>

<p class="label">Alliance No.2 SemiBold (600) — 35.7 / 48 / -1.2</p>
<div class="row" style="font-family:AN2">B2B SaaS companies don't have an ads problem.</div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 500 } });
await p.setContent(html);
await p.waitForTimeout(400);
const box = await p.locator('body').boundingBox();
const out = path.join(ROOT, '_previews', '_font-compare.png');
await p.screenshot({ path: out, clip: { x: 0, y: 0, width: Math.ceil(box.width), height: Math.ceil(box.height) } });
console.log('saved', out);
await b.close();
