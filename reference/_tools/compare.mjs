// Compare tool.
// Uzima screenshot lokalne sekcije na zadatom viewport-u, sastavlja uporedni
// prikaz sa design.png i original*.png koji odgovaraju toj širini, snima u
// reference/_previews/compare-<slug>[-<width>].png.
//
// Selector može biti jedan CSS izraz, ili više razdvojenih zarezom — u tom
// slučaju uzima uniju bounding box-eva svih pronađenih elemenata.
//
// Za original slike: bira samo one koji odgovaraju zadatoj širini.
//   width=1440 → original.png / original-heading.png / original-subtitle.png
//   width=N    → original-N.png / original-heading-N.png / original-subtitle-N.png
//
// Usage:
//   node reference/_tools/compare.mjs <slug> --selector="…" [--width=N] [--url=…]
//
// Primer:
//   node reference/_tools/compare.mjs 01-hero --width=991 --selector=".hero-heading, .hero-subtitle"

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const PREVIEWS = path.join(ROOT, "_previews");

function argMap(argv) {
  const m = new Map();
  for (const a of argv) {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    m.set(k, v.join("=") || true);
  }
  return m;
}

async function fileToDataUrl(p) {
  const buf = await fs.readFile(p);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

// Filtrira original*.png fajlove tako da vrati samo one za zadatu širinu.
// Pravilo: fajl se prihvata ako
//   width=1440  → nema sufiks -<n> (bez cifara pre .png)
//   width=N     → ima sufiks -N
function selectOriginals(files, width) {
  const re = /^original(?:-[a-zA-Z]+)?(-(\d+))?\.png$/i;
  const out = [];
  for (const f of files) {
    const m = re.exec(f);
    if (!m) continue;
    const suf = m[2] ? Number(m[2]) : 1440;
    if (suf === width) out.push(f);
  }
  return out.sort();
}

async function main() {
  const [slug, ...rest] = process.argv.slice(2);
  if (!slug) {
    console.error('Usage: node compare.mjs <slug> --selector="…" [--width=N] [--url=…]');
    process.exit(1);
  }
  const args = argMap(rest);
  const url = args.get("url") || "http://localhost:4321/";
  const selectorArg = args.get("selector") || "body";
  const width = Number(args.get("width") ?? 1440);
  const selectors = selectorArg.split(",").map(s => s.trim()).filter(Boolean);

  const sectionDir = path.join(ROOT, slug);
  const designPath = path.join(sectionDir, "design.png");
  const outName = width === 1440 ? `compare-${slug}.png` : `compare-${slug}-${width}.png`;
  const outPath = path.join(PREVIEWS, outName);
  await fs.mkdir(PREVIEWS, { recursive: true });

  const hasDesign = width === 1440 && await exists(designPath);

  // Naći original*.png za odgovarajuću širinu
  const dirFiles = await fs.readdir(sectionDir).catch(() => []);
  const originalFiles = selectOriginals(dirFiles, width);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const boxes = [];
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    const b = await loc.boundingBox().catch(() => null);
    if (b) boxes.push(b);
  }
  if (boxes.length === 0) {
    console.error("No matching elements for selectors:", selectors);
    process.exit(1);
  }
  const x0 = Math.min(...boxes.map(b => b.x));
  const y0 = Math.min(...boxes.map(b => b.y));
  const x1 = Math.max(...boxes.map(b => b.x + b.width));
  const y1 = Math.max(...boxes.map(b => b.y + b.height));
  const clip = { x: Math.floor(x0), y: Math.floor(y0), width: Math.ceil(x1 - x0), height: Math.ceil(y1 - y0) };

  const minePath = path.join(PREVIEWS, `_tmp-${slug}-${width}-mine.png`);
  await page.screenshot({ path: minePath, clip, scale: "css", animations: "disabled" });

  const parts = [];
  if (hasDesign) parts.push({ label: "design.png (×0.5)", src: await fileToDataUrl(designPath), scale: 0.5 });
  for (const f of originalFiles) {
    parts.push({ label: `${f} (1:1)`, src: await fileToDataUrl(path.join(sectionDir, f)), scale: 1 });
  }
  parts.push({ label: `mine @ ${width}×900 — [${selectorArg}] ${url}`, src: await fileToDataUrl(minePath), scale: 1 });

  const composeW = Math.max(width, 900) + 40;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body { margin: 0; padding: 20px; background: #eee; font-family: -apple-system, sans-serif; font-size: 12px; color: #333; }
    .row { margin-bottom: 24px; }
    .label { margin: 0 0 6px 0; color: #555; }
    .frame { background: #fff; border: 1px solid #bbb; display: inline-block; max-width: 100%; }
    img { display: block; }
  </style></head><body>
    ${parts.map(p => `
      <div class="row">
        <p class="label">${p.label}</p>
        <div class="frame"><img src="${p.src}"></div>
      </div>
    `).join("")}
  </body></html>`;

  await page.setViewportSize({ width: composeW, height: 2400 });
  await page.setContent(html);
  await page.evaluate((scales) => {
    const imgs = Array.from(document.images);
    imgs.forEach((img, i) => {
      const s = scales[i];
      if (s !== 1) img.style.width = `${Math.round(img.naturalWidth * s)}px`;
    });
  }, parts.map(p => p.scale));
  await page.waitForTimeout(200);

  const body = await page.locator("body").boundingBox();
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: Math.ceil(body.width), height: Math.ceil(body.height) } });

  await fs.rm(minePath, { force: true });
  await browser.close();

  console.log(`saved ${path.relative(ROOT, outPath)}  (mine clip: ${clip.width}×${clip.height})`);
}

main().catch(e => { console.error(e); process.exit(1); });
