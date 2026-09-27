// Ekstraktuje ključne responsive vrednosti iz svih styles-*.json i ispisuje
// tabelu po širini za brz pregled i prepisivanje u summary.md.
//
// Usage: node reference/_tools/responsive-diff.mjs

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

const WIDTHS = [1440, 991, 767, 479, 1920];
function file(dir, base) {
  return async (w) => {
    const suf = w === 1440 ? '' : `-${w}`;
    const p = path.join(ROOT, dir, `${base}${suf}.json`);
    try { return JSON.parse(await fs.readFile(p, 'utf8')); } catch { return null; }
  };
}

function pick(o, dotpath) {
  return dotpath.split('.').reduce((a, k) => a == null ? a : a[k], o);
}

// Rekurzivno traži prvi element (chosen ili tree.children) po jednoj klasi
function findByClass(node, cls) {
  if (!node) return null;
  if (node.classes && node.classes.includes(cls)) return node;
  if (node.children) for (const c of node.children) {
    const r = findByClass(c, cls);
    if (r) return r;
  }
  return null;
}

async function report() {
  console.log('\n============  00-global  ============');
  const global = file('00-global', 'styles');
  for (const w of WIDTHS) {
    const d = await global(w);
    if (!d) { console.log(`  ${w}: (nema fajla)`); continue; }
    const c = d.container;
    console.log(`  ${String(w).padStart(4)}px: body.font=${pick(d, 'body.styles.fontSize')}  container.w=${c?.box?.w ?? '—'}  max-w=${c?.styles?.maxWidth ?? '—'}  padding=${c?.styles?.padding ?? '—'}  border-L=${c?.styles?.borderLeft ?? '—'}`);
  }

  console.log('\n============  00-header  ============');
  const header = file('00-header', 'styles');
  for (const w of WIDTHS) {
    const d = await header(w);
    if (!d) { console.log(`  ${w}: (nema fajla)`); continue; }
    const nav = d.tree;
    const box = pick(d, 'chosen.box');
    const menu = findByClass(nav, 'dropdown-links');
    const hamburger = findByClass(nav, 'w-nav-button') || findByClass(nav, 'menu-button');
    const cta = findByClass(nav, 'cta-button') || findByClass(nav, 'div-block-510');
    console.log(`  ${String(w).padStart(4)}px: nav ${box?.w}×${box?.h}  padding=${nav?.styles?.padding ?? '—'}`);
    console.log(`         menu.dropdown-links: ${menu ? `display=${menu.styles?.display ?? '?'} box=${menu.box?.w}×${menu.box?.h}` : 'NIJE PRONAĐEN (možda display:none)'}`);
    console.log(`         hamburger:           ${hamburger ? `display=${hamburger.styles?.display ?? '?'} box=${hamburger.box?.w}×${hamburger.box?.h}` : 'nema'}`);
    console.log(`         CTA wrapper:         ${cta ? `display=${cta.styles?.display ?? '?'} box=${cta.box?.w}×${cta.box?.h}` : 'nema'}`);
  }

  console.log('\n============  01-hero heading  ============');
  const heroH = file('01-hero', 'styles-heading');
  for (const w of WIDTHS) {
    const d = await heroH(w);
    if (!d) { console.log(`  ${w}: (nema fajla)`); continue; }
    const grid = d.tree;
    const h1 = findByClass(grid, 'main-heading');
    console.log(`  ${String(w).padStart(4)}px: .main-heading-grid ${grid?.box?.w}×${grid?.box?.h}  grid-cols=${grid?.styles?.['grid-template-columns'] ?? '—'}`);
    console.log(`         h1.font=${h1?.styles?.['font-size'] ?? '—'}  line=${h1?.styles?.['line-height'] ?? '—'}  tracking=${h1?.styles?.['letter-spacing'] ?? '—'}`);
  }

  console.log('\n============  01-hero subtitle  ============');
  const heroS = file('01-hero', 'styles-subtitle');
  for (const w of WIDTHS) {
    const d = await heroS(w);
    if (!d) { console.log(`  ${w}: (nema fajla)`); continue; }
    const grid = d.tree;
    const wrap = findByClass(grid, 'hero-content-wrapper');
    const p = findByClass(grid, 'content-paragraph');
    console.log(`  ${String(w).padStart(4)}px: .hero-grid ${grid?.box?.w}×${grid?.box?.h}  grid-cols=${grid?.styles?.['grid-template-columns'] ?? '—'}`);
    console.log(`         wrapper padding=${wrap?.styles?.padding ?? '—'}   p.font=${p?.styles?.['font-size'] ?? '—'}  line=${p?.styles?.['line-height'] ?? '—'}  w=${p?.box?.w}`);
  }

  console.log('\n============  02-case-study  ============');
  const cs = file('02-case-study', 'styles');
  for (const w of WIDTHS) {
    const d = await cs(w);
    if (!d) { console.log(`  ${w}: (nema fajla)`); continue; }
    const sec = d.tree;
    const slider = findByClass(sec, 'slider-3') || findByClass(sec, 'w-slider');
    const wrap = findByClass(sec, 'hero-slider-wrapper');
    const heroSlider = findByClass(sec, 'hero-slider');
    const contentWrap = findByClass(sec, 'hero-slider-content-wrapper');
    const imgWrap = findByClass(sec, 'hero-slider-image-wrapper');
    console.log(`  ${String(w).padStart(4)}px: section ${sec?.box?.w}×${sec?.box?.h}  section.padding=${sec?.styles?.padding ?? '—'}`);
    console.log(`         slider ${slider?.box?.w}×${slider?.box?.h}  radius=${slider?.styles?.['border-radius'] ?? '—'}`);
    console.log(`         wrapper padding=${wrap?.styles?.padding ?? '—'}  flex-dir=${wrap?.styles?.['flex-direction'] ?? '—'}`);
    console.log(`         hero-slider ${heroSlider?.box?.w}×${heroSlider?.box?.h}  flex-dir=${heroSlider?.styles?.['flex-direction'] ?? '—'}`);
    console.log(`         content-wrap ${contentWrap?.box?.w}×${contentWrap?.box?.h}   image-wrap ${imgWrap?.box?.w}×${imgWrap?.box?.h}`);
  }
}

report().catch(e => { console.error(e); process.exit(1); });
