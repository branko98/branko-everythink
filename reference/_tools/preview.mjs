// preview.mjs — bezbedan "otvarač" slika za Claude.
//
// Ulaz: putanja do slike (originala).
// Ako je bilo koja strana veća od MAX px, generiše umanjenu kopiju u
// reference/_previews/<basename>-preview.png (max stranica = MAX) i ispisuje
// putanju do te kopije na stdout. Ako je slika manja, ispisuje originalnu
// putanju. Originalu se nikad ne dira.
//
// Usage:
//   node reference/_tools/preview.mjs <path-to-image>
//   # ispisuje putanju do bezbedne verzije (original ili preview thumb)
//
// Programsko korišćenje:
//   import { previewPath } from "./preview.mjs";
//   const safe = await previewPath("/abs/path/to/image.png");

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const PREVIEWS = path.join(ROOT, "_previews");
const MAX = 1800;

async function imageSize(p) {
  const buf = await fs.readFile(p);
  const dataUrl = `data:image/${path.extname(p).slice(1).toLowerCase() || "png"};base64,${buf.toString("base64")}`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(`<img id="i" src="${dataUrl}">`);
    await page.waitForFunction(() => {
      const el = document.getElementById("i");
      return el && el.complete && el.naturalWidth > 0;
    });
    return await page.evaluate(() => {
      const el = document.getElementById("i");
      return { w: el.naturalWidth, h: el.naturalHeight };
    });
  } finally {
    await browser.close();
  }
}

async function shrink(srcPath, outPath, srcW, srcH) {
  const scale = MAX / Math.max(srcW, srcH);
  const outW = Math.max(1, Math.round(srcW * scale));
  const outH = Math.max(1, Math.round(srcH * scale));
  const buf = await fs.readFile(srcPath);
  const ext = (path.extname(srcPath).slice(1) || "png").toLowerCase();
  const dataUrl = `data:image/${ext};base64,${buf.toString("base64")}`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: outW, height: outH });
    await page.setContent(
      `<!doctype html><html><body style="margin:0;padding:0;background:transparent;">
       <img src="${dataUrl}" style="display:block;width:${outW}px;height:${outH}px;">
       </body></html>`
    );
    await page.waitForFunction(() => document.images[0]?.complete);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: outW, height: outH },
      omitBackground: true,
    });
  } finally {
    await browser.close();
  }
  return { outW, outH };
}

export async function previewPath(imgPath) {
  const abs = path.resolve(imgPath);
  await fs.access(abs);
  const { w, h } = await imageSize(abs);
  if (Math.max(w, h) <= MAX) return abs;
  const base = path.basename(abs, path.extname(abs));
  const out = path.join(PREVIEWS, `${base}-preview.png`);
  await shrink(abs, out, w, h);
  return out;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node reference/_tools/preview.mjs <path-to-image>");
    process.exit(1);
  }
  const p = await previewPath(arg);
  console.log(p);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
