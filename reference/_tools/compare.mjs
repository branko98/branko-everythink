// Compare tool.
// Uzima screenshot lokalne sekcije, sastavlja uporedni prikaz sa
// design.png (skaliran ×0.5) i original*.png, snima u
// reference/_previews/compare-<slug>.png.
//
// Selector može biti jedan CSS izraz, ili više razdvojenih zarezom — u tom
// slučaju uzima uniju bounding box-eva svih pronađenih elemenata.
//
// Za original slike: ako postoji <sectionDir>/original.png koristi njega;
// inače traži sve fajlove koji počinju sa "original" i slaže ih vertikalno.
//
// Usage:
//   node reference/_tools/compare.mjs <slug> [--url=…] --selector="sel1, sel2, …"

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

async function main() {
  const [slug, ...rest] = process.argv.slice(2);
  if (!slug) {
    console.error('Usage: node compare.mjs <slug> [--url=…] --selector="sel1, sel2, …"');
    process.exit(1);
  }
  const args = argMap(rest);
  const url = args.get("url") || "http://localhost:4321/";
  const selectorArg = args.get("selector") || "body";
  const selectors = selectorArg.split(",").map(s => s.trim()).filter(Boolean);

  const sectionDir = path.join(ROOT, slug);
  const designPath = path.join(sectionDir, "design.png");
  const outPath = path.join(PREVIEWS, `compare-${slug}.png`);
  await fs.mkdir(PREVIEWS, { recursive: true });

  const hasDesign = await exists(designPath);

  // Naći sve original*.png u sectionDir
  const dirFiles = await fs.readdir(sectionDir).catch(() => []);
  const originalFiles = dirFiles.filter(f => /^original.*\.png$/i.test(f)).sort();

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  // 1) Screenshot lokalne sekcije — unija bbox-a svih selektora
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

  const minePath = path.join(PREVIEWS, `_tmp-${slug}-mine.png`);
  await page.screenshot({ path: minePath, clip, scale: "css", animations: "disabled" });

  // 2) Sastavi HTML za poređenje
  const parts = [];
  if (hasDesign) parts.push({ label: "design.png (×0.5)", src: await fileToDataUrl(designPath), scale: 0.5 });
  for (const f of originalFiles) {
    parts.push({ label: `${f} (1:1)`, src: await fileToDataUrl(path.join(sectionDir, f)), scale: 1 });
  }
  parts.push({ label: `mine — [${selectorArg}] @ ${url}`, src: await fileToDataUrl(minePath), scale: 1 });

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

  await page.setViewportSize({ width: 1700, height: 2000 });
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
