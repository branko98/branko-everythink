// Audit ambiguous selectors: dump match count + per-candidate screenshot + box.
// Usage: node reference/_tools/audit.mjs

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const OUT = path.join(ROOT, '_previews', 'audit');
await fs.mkdir(OUT, { recursive: true });

async function dismissCookies(page) {
  const candidates = ['button:has-text("Accept")', 'button:has-text("Prihvati")'];
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

async function auditSelector(page, tag, selector) {
  const list = page.locator(selector);
  const count = await list.count();
  console.log(`  [${tag}] '${selector}' → ${count} hits`);
  const boxes = [];
  const shots = [];
  for (let i = 0; i < Math.min(count, 6); i++) {
    const el = list.nth(i);
    let box;
    try {
      box = await el.boundingBox();
    } catch { box = null; }
    if (!box || box.width < 10 || box.height < 10) {
      boxes.push({ i, box, skipped: 'zero-size or invisible' });
      continue;
    }
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const filename = path.join(OUT, `${tag}_${i}.png`);
      await el.screenshot({ path: filename, scale: 'css', animations: 'disabled' });
      shots.push(path.relative(ROOT, filename));
      const classes = await el.evaluate(n => Array.from(n.classList));
      const tagName = await el.evaluate(n => n.tagName.toLowerCase());
      boxes.push({ i, box, classes, tag: tagName, shot: path.relative(ROOT, filename) });
    } catch (e) {
      boxes.push({ i, box, err: String(e).slice(0, 200) });
    }
  }
  return { selector, count, candidates: boxes };
}

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const report = {};

  console.log('== omnius.so ==');
  await page.goto('https://www.omnius.so', { waitUntil: 'load' });
  await dismissCookies(page);
  report['omnius.so'] = {
    graphSection: await auditSelector(page, 'omnius_graph', '.section.graph-section'),
    ctaWrapper:   await auditSelector(page, 'omnius_cta',   '.cta-wrapper.gradient-background.cta-height.dark-mode-cta-new-style'),
  };

  console.log('== omnius.so/programmatic-seo ==');
  await page.goto('https://www.omnius.so/programmatic-seo', { waitUntil: 'load' });
  await dismissCookies(page);
  report['omnius.so/programmatic-seo'] = {
    stats:        await auditSelector(page, 'pseo_stats',    '.stats-grid-4-cols'),
    headingGrid:  await auditSelector(page, 'pseo_heading',  '.heading-grid'),
    cardsFlex:    await auditSelector(page, 'pseo_cards',    '.container.container-flex'),
  };

  console.log('== omnius.so/geo-agency ==');
  await page.goto('https://www.omnius.so/geo-agency', { waitUntil: 'load' });
  await dismissCookies(page);
  report['omnius.so/geo-agency'] = {
    testFeatured: await auditSelector(page, 'geo_testfeat',  '[data-w-id="f8e998fe-cee6-c8ce-f335-f4becaabef63"]'),
    testWrapper:  await auditSelector(page, 'geo_testwrap',  '.testimonial-wrapper'),
    sectionOmar:  await auditSelector(page, 'geo_omar',      '.section-omar.middle-section'),
  };

  await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log('Report saved to', path.relative(ROOT, path.join(OUT, 'report.json')));

  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
