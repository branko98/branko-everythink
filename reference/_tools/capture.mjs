// One-shot capture driver.
// Loads extract.js into each target page, takes screenshots + writes JSON.
// Usage: node reference/_tools/capture.mjs

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const EXTRACT_SRC = await fs.readFile(path.join(ROOT, '_tools/extract.js'), 'utf8');

async function withExtract(page) {
  await page.addScriptTag({ content: EXTRACT_SRC });
}

async function dismissCookies(page) {
  const candidates = [
    'button:has-text("Accept")',
    'button:has-text("Prihvati")',
    '[aria-label*="cookie" i] button',
    '.cookie button',
  ];
  for (const s of candidates) {
    try {
      const loc = page.locator(s).first();
      if (await loc.count() > 0 && await loc.isVisible({ timeout: 500 })) {
        await loc.click({ timeout: 1000 });
        await page.waitForTimeout(300);
        break;
      }
    } catch {}
  }
}

async function capture(page, selector, outPng, outJson) {
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await loc.screenshot({ path: outPng, scale: 'css', animations: 'disabled' });
  const data = await page.evaluate((sel) => window.__extract(sel), selector);
  await fs.writeFile(outJson, JSON.stringify(data, null, 2));
  console.log(`  saved ${path.relative(ROOT, outPng)}  and  ${path.relative(ROOT, outJson)}  hits=${data.matchCount}`);
  return data;
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // ---------- 00-global (from omnius.so) ----------
  console.log('== 00-global (omnius.so) ==');
  await page.goto('https://www.omnius.so', { waitUntil: 'load' });
  await dismissCookies(page);
  await withExtract(page);

  const global = await page.evaluate(() => {
    const cs = (el) => {
      const c = getComputedStyle(el);
      return {
        display: c.display, position: c.position,
        width: c.width, maxWidth: c.maxWidth, height: c.height,
        padding: `${c.paddingTop} ${c.paddingRight} ${c.paddingBottom} ${c.paddingLeft}`,
        margin: `${c.marginTop} ${c.marginRight} ${c.marginBottom} ${c.marginLeft}`,
        borderLeft: `${c.borderLeftWidth} ${c.borderLeftStyle} ${c.borderLeftColor}`,
        borderRight: `${c.borderRightWidth} ${c.borderRightStyle} ${c.borderRightColor}`,
        fontFamily: c.fontFamily, fontSize: c.fontSize, fontWeight: c.fontWeight,
        lineHeight: c.lineHeight, letterSpacing: c.letterSpacing,
        color: c.color, backgroundColor: c.backgroundColor,
      };
    };
    const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; };

    const container = document.querySelector('.container.w-container');
    const belowNav = document.querySelector('.below-nav-container');

    // Sample a few container variants to see uniform padding/border pattern
    const containerVariants = [];
    const seen = new Set();
    document.querySelectorAll('.container.w-container').forEach(el => {
      const key = Array.from(el.classList).sort().join('.');
      if (seen.has(key)) return;
      seen.add(key);
      containerVariants.push({
        classes: Array.from(el.classList),
        box: box(el),
        styles: cs(el),
      });
    });

    const fonts = [];
    if (document.fonts) {
      for (const f of document.fonts) {
        if (f.status === 'loaded') fonts.push({ family: f.family.replace(/^["']|["']$/g,''), weight: f.weight, style: f.style, unicodeRange: f.unicodeRange });
      }
    }

    // Dedup fonts by family+weight+style
    const seenF = new Set();
    const fontsDedup = fonts.filter(f => {
      const k = `${f.family}|${f.weight}|${f.style}`;
      if (seenF.has(k)) return false; seenF.add(k); return true;
    });

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      html: { styles: cs(document.documentElement), box: box(document.documentElement) },
      body: { styles: cs(document.body), box: box(document.body) },
      container: container ? { classes: Array.from(container.classList), styles: cs(container), box: box(container) } : null,
      belowNav: belowNav ? { classes: Array.from(belowNav.classList), styles: cs(belowNav), box: box(belowNav) } : null,
      containerVariants,
      fonts: fontsDedup,
      note: 'Grid lines are drawn by .container.w-container using border-left/right: 1px dashed rgb(208, 213, 221). No single overlay element.',
    };
  });
  await fs.writeFile(path.join(ROOT, '00-global/styles.json'), JSON.stringify(global, null, 2));
  console.log('  saved 00-global/styles.json');

  // ---------- 00-header (omnius.so, .white-navbar) ----------
  console.log('== 00-header (omnius.so, .white-navbar) ==');
  await capture(page, '.white-navbar',
    path.join(ROOT, '00-header/original.png'),
    path.join(ROOT, '00-header/styles.json'));

  // ---------- 01-hero heading (omnius.so, .main-heading-grid) ----------
  console.log('== 01-hero heading (omnius.so, .main-heading-grid) ==');
  await capture(page, '.main-heading-grid',
    path.join(ROOT, '01-hero/original-heading.png'),
    path.join(ROOT, '01-hero/styles-heading.json'));

  // ---------- 01-hero subtitle (content-marketing) ----------
  console.log('== 01-hero subtitle (content-marketing, .hero-grid.light-theme.without-grid) ==');
  await page.goto('https://www.omnius.so/content-marketing', { waitUntil: 'load' });
  await dismissCookies(page);
  await withExtract(page);
  await capture(page, '.hero-grid.light-theme.without-grid',
    path.join(ROOT, '01-hero/original-subtitle.png'),
    path.join(ROOT, '01-hero/styles-subtitle.json'));

  await browser.close();
  console.log('DONE');
}

main().catch(e => { console.error(e); process.exit(1); });
