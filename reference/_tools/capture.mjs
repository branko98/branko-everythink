// Capture driver — Playwright loader that snima screenshot i JSON iz omnius.so.
// Ekstenzija za responsive: prima --width i --sections.
//
// Usage:
//   node reference/_tools/capture.mjs                              # sve sekcije, 1440×900
//   node reference/_tools/capture.mjs --width=991                  # sve sekcije, 991×900
//   node reference/_tools/capture.mjs --width=991 --sections=global,header,hero,case-study
//   node reference/_tools/capture.mjs --width=479 --sections=all
//
// Fajlovi:
//   Na 1440 (default) — bez sufiksa: original.png / styles.json (backwards compat).
//   Na drugim širinama — sa sufiksom: original-991.png / styles-991.json
//   (za hero: original-heading-991.png, original-subtitle-991.png).
//
// Visina viewporta je 900 za sve širine (uključujući 479, po specifikaciji).

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const EXTRACT_SRC = await fs.readFile(path.join(ROOT, '_tools/extract.js'), 'utf8');

function parseArgs(argv) {
  const m = new Map();
  for (const a of argv) {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    m.set(k, v.join('=') || true);
  }
  return m;
}

const args = parseArgs(process.argv.slice(2));
const WIDTH = Number(args.get('width') ?? 1440);
const SECTIONS = String(args.get('sections') ?? 'all').split(',').map(s => s.trim());
const RUN_ALL = SECTIONS.includes('all');
function shouldRun(key) { return RUN_ALL || SECTIONS.includes(key); }

// Sufiks u imenu fajla: bez sufiksa na 1440, `-N` na ostalim širinama.
const SUFFIX = WIDTH === 1440 ? '' : `-${WIDTH}`;
function withSuffix(basename, ext) {
  return `${basename}${SUFFIX}.${ext}`;
}

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

async function capture(page, selector, outPng, outJson, { index = 0 } = {}) {
  const loc = page.locator(selector).nth(index);
  const count = await loc.count().catch(() => 0);
  if (count === 0) {
    console.log(`  SKIP ${selector} — nije pronađen (verovatno sakriven na ovoj širini).`);
    return null;
  }
  const isVisible = await loc.isVisible().catch(() => false);
  if (!isVisible) {
    console.log(`  SKIP ${selector} — display: none na ovoj širini; ipak snimam JSON.`);
  } else {
    try { await loc.scrollIntoViewIfNeeded(); } catch {}
    await page.waitForTimeout(2000);
    await loc.screenshot({ path: outPng, scale: 'css', animations: 'disabled' }).catch(e => {
      console.log(`  WARN screenshot failed: ${e.message}`);
    });
  }
  const data = await page.evaluate(([sel, idx]) => window.__extract(sel, idx), [selector, index]);
  await fs.writeFile(outJson, JSON.stringify(data, null, 2));
  console.log(`  saved ${path.relative(ROOT, outJson)}  hits=${data.matchCount} idx=${index}`);
  return data;
}

// Ekstrakcija globalnih vrednosti (isti obim kao original)
async function captureGlobal(page, outJson) {
  const data = await page.evaluate(() => {
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
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
    };

    const container = document.querySelector('.container.w-container');
    const belowNav = document.querySelector('.below-nav-container');

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
        if (f.status === 'loaded') fonts.push({ family: f.family.replace(/^["']|["']$/g, ''), weight: f.weight, style: f.style, unicodeRange: f.unicodeRange });
      }
    }
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
  await fs.writeFile(outJson, JSON.stringify(data, null, 2));
  console.log(`  saved ${path.relative(ROOT, outJson)}`);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 } });
  const page = await context.newPage();

  console.log(`\n>> Capture @ ${WIDTH}×900   sections=${SECTIONS.join(',')}\n`);

  // ---------- omnius.so page ----------
  if (shouldRun('global') || shouldRun('header') || shouldRun('hero') || shouldRun('case-study') || shouldRun('cta')) {
    console.log('== omnius.so ==');
    await page.goto('https://www.omnius.so', { waitUntil: 'load' });
    await dismissCookies(page);
    await withExtract(page);
  }

  if (shouldRun('global')) {
    console.log('-- 00-global');
    await captureGlobal(page, path.join(ROOT, '00-global', withSuffix('styles', 'json')));
  }

  if (shouldRun('header')) {
    console.log('-- 00-header (.white-navbar)');
    await capture(page, '.white-navbar',
      path.join(ROOT, '00-header', withSuffix('original', 'png')),
      path.join(ROOT, '00-header', withSuffix('styles', 'json')));
  }

  if (shouldRun('hero')) {
    console.log('-- 01-hero heading (.main-heading-grid)');
    await capture(page, '.main-heading-grid',
      path.join(ROOT, '01-hero', withSuffix('original-heading', 'png')),
      path.join(ROOT, '01-hero', withSuffix('styles-heading', 'json')));
  }

  if (shouldRun('case-study')) {
    console.log('-- 02-case-study (.section.graph-section)');
    await capture(page, '.section.graph-section',
      path.join(ROOT, '02-case-study', withSuffix('original', 'png')),
      path.join(ROOT, '02-case-study', withSuffix('styles', 'json')));
  }

  if (shouldRun('cta')) {
    console.log('-- 08-cta-dark');
    await capture(page, '.cta-wrapper.gradient-background.cta-height.dark-mode-cta-new-style',
      path.join(ROOT, '08-cta-dark', withSuffix('original', 'png')),
      path.join(ROOT, '08-cta-dark', withSuffix('styles', 'json')));
  }

  // ---------- content-marketing (za hero subtitle) ----------
  if (shouldRun('hero')) {
    console.log('== content-marketing ==');
    await page.goto('https://www.omnius.so/content-marketing', { waitUntil: 'load' });
    await dismissCookies(page);
    await withExtract(page);
    console.log('-- 01-hero subtitle (.hero-grid.light-theme.without-grid)');
    await capture(page, '.hero-grid.light-theme.without-grid',
      path.join(ROOT, '01-hero', withSuffix('original-subtitle', 'png')),
      path.join(ROOT, '01-hero', withSuffix('styles-subtitle', 'json')));
  }

  // ---------- programmatic-seo (03 / 05 / 06) ----------
  if (shouldRun('stats') || shouldRun('section-heading') || shouldRun('question-cards')) {
    console.log('== programmatic-seo ==');
    await page.goto('https://www.omnius.so/programmatic-seo', { waitUntil: 'load' });
    await dismissCookies(page);
    await withExtract(page);

    if (shouldRun('stats')) {
      await capture(page, '.stats-grid-4-cols',
        path.join(ROOT, '03-stats', withSuffix('original', 'png')),
        path.join(ROOT, '03-stats', withSuffix('styles', 'json')));
    }
    if (shouldRun('section-heading')) {
      await capture(page, '.heading-grid',
        path.join(ROOT, '05-section-heading', withSuffix('original', 'png')),
        path.join(ROOT, '05-section-heading', withSuffix('styles', 'json')));
    }
    if (shouldRun('question-cards')) {
      await capture(page, '.container.container-flex',
        path.join(ROOT, '06-question-cards', withSuffix('original', 'png')),
        path.join(ROOT, '06-question-cards', withSuffix('styles', 'json')));
    }
  }

  // ---------- geo-agency (04 / 09) ----------
  if (shouldRun('testimonial-featured') || shouldRun('testimonial-list')) {
    console.log('== geo-agency ==');
    await page.goto('https://www.omnius.so/geo-agency', { waitUntil: 'load' });
    await dismissCookies(page);
    await withExtract(page);
    if (shouldRun('testimonial-featured')) {
      await capture(page, '[data-w-id="f8e998fe-cee6-c8ce-f335-f4becaabef63"]',
        path.join(ROOT, '04-testimonial-featured', withSuffix('original', 'png')),
        path.join(ROOT, '04-testimonial-featured', withSuffix('styles', 'json')));
    }
    if (shouldRun('testimonial-list')) {
      await capture(page, '.testimonial-wrapper',
        path.join(ROOT, '09-testimonial-list', withSuffix('original', 'png')),
        path.join(ROOT, '09-testimonial-list', withSuffix('styles', 'json')),
        { index: 1 });
    }
  }

  await browser.close();
  console.log('\nDONE');
}

main().catch(e => { console.error(e); process.exit(1); });
