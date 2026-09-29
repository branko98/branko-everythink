// Scroll-driven motion: fade-up reveals, typed headlines, counters, chart and staircase drawing.
// Everything is a progressive enhancement: without the `motion` class on <html> nothing is hidden.

const root = document.documentElement;
const motion = root.classList.contains('motion');

/* ---------------- typing ---------------- */
function prepareTyping(el: HTMLElement): HTMLElement[] {
  const tokens: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text) continue;
        const frag = document.createDocumentFragment();
        // keep words unbreakable so hidden letters never change line wrapping
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = part;
            frag.appendChild(s);
            tokens.push(s);
            continue;
          }
          const word = document.createElement('span');
          word.className = 'w';
          for (const c of Array.from(part)) {
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = c;
            word.appendChild(s);
            tokens.push(s);
          }
          frag.appendChild(word);
        }
        child.replaceWith(frag);
      } else if (child instanceof HTMLImageElement) {
        child.classList.add('ch');
        tokens.push(child);
      } else if (child instanceof HTMLElement) {
        walk(child);
      }
    }
  };
  walk(el);
  return tokens;
}

function type(el: HTMLElement) {
  if (el.dataset.typed) return;
  el.dataset.typed = '1';
  const tokens = (el as any)._tokens as HTMLElement[];
  const total = Number(el.dataset.type) || 1500;
  const step = Math.min(30, Math.max(8, total / tokens.length));
  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.setAttribute('aria-hidden', 'true');
  let i = 0;
  let last = performance.now();
  const tick = (now: number) => {
    while (now - last >= step && i < tokens.length) {
      tokens[i].classList.add('on');
      last += step;
      i++;
    }
    const cur = tokens[Math.max(0, i - 1)];
    if (cur && cur.nextSibling !== caret) cur.after(caret);
    if (i < tokens.length) requestAnimationFrame(tick);
    else {
      caret.classList.add('done');
      setTimeout(() => caret.remove(), 3200);
    }
  };
  requestAnimationFrame(tick);
}

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
  if (h.hasAttribute('data-type')) type(h);
  h.querySelectorAll<HTMLElement>('[data-count]').forEach(count);
}

function init() {
  if (!motion) return;

  const typed = document.querySelectorAll<HTMLElement>('[data-type]');
  typed.forEach((el) => ((el as any)._tokens = prepareTyping(el)));

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
