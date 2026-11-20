// Scroll-driven motion: fade-up reveals, typed headlines, counters, chart and staircase drawing.
// Everything is a progressive enhancement: without the `motion` class on <html> nothing is hidden.

import { prepareTyping, typeIn } from './typing';

const root = document.documentElement;
const motion = root.classList.contains('motion');

/* ---------------- counters ---------------- */
function count(el: HTMLElement) {
  const raw = el.dataset.count ?? el.textContent ?? '';
  const m = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return;
  const [, pre, num, suf] = m;
  const target = parseFloat(num.replace(/,/g, ''));
  if (!target) return; // "00" stays as it is
  const decimals = (num.split('.')[1] ?? '').length;
  const pad = num.length;
  const dur = 1600;
  const t0 = performance.now();
  const frame = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 4);
    let v = (target * e).toFixed(decimals);
    if (!decimals && /^0/.test(num)) v = v.padStart(pad, '0');
    el.textContent = `${pre}${v}${suf}`;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = raw;
  };
  requestAnimationFrame(frame);
}

/* ---------------- wiring ---------------- */
function onIn(el: Element) {
  const h = el as HTMLElement;
  h.classList.add('is-in');
  if (h.hasAttribute('data-type')) typeIn(h, Number(h.dataset.type) || 1500);
  h.querySelectorAll<HTMLElement>('[data-count]').forEach(count);
}

function init() {
  if (!motion) return;

  const typed = document.querySelectorAll<HTMLElement>('[data-type]');
  typed.forEach((el) => prepareTyping(el));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          onIn(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
  );

  document
    .querySelectorAll('[data-reveal], [data-type], .chart, [data-counters]')
    .forEach((el) => io.observe(el));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
