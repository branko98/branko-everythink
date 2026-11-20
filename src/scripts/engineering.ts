// Scroll behaviour for the "How the system is built" plates (ported from the design file's logic).
// - No scroll takeover: a passive, rAF-throttled scroll listener plus class toggles and transforms.
// - The markup starts in its final state; this script folds the stack only when it can animate it.
// - Reduced motion (or no IntersectionObserver support → no `motion` class): nothing happens.
import { resetTyping, showTyped, typeIn } from './typing';

const NARROW = '(max-width: 899px)'; // the site's one-column breakpoint (design file used 860 px)
const TITLE_MS = 650; // title typing time (tightened from the design's .9 s)

export function initEngineering(sec: HTMLElement) {
  const html = document.documentElement;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !html.classList.contains('motion')) return; // final state, no listeners

  const plws = Array.from(sec.querySelectorAll<HTMLElement>('[data-eng-plw]'));
  const units = Array.from(sec.querySelectorAll<HTMLElement>('[data-eng-unit]'));
  const copies = Array.from(sec.querySelectorAll<HTMLElement>('[data-eng-copy]'));
  const titles = Array.from(sec.querySelectorAll<HTMLElement>('[data-eng-title]'));
  if (plws.length < 3) return;

  const state = { mode: 'open' as 'open' | 'closed', instant: false, t1: 0, t2: 0, on: [true, true, true] };
  let raf = 0;
  let openAt = 0;
  let dwell = 0;
  let dir: 'down' | 'up' = 'down';
  let lastTop: number | null = null;
  let prevOn = [true, true, true];

  // write state to the DOM
  const apply = () => {
    const closed = state.mode === 'closed';
    sec.classList.toggle('is-closed', closed);
    sec.classList.toggle('is-instant', state.instant);
    plws[1].style.transform = closed ? `translate3d(0, ${state.t1}px, 0)` : '';
    plws[2].style.transform = closed ? `translate3d(0, ${state.t2}px, 0)` : '';
    units.forEach((u, i) => {
      u.classList.toggle('is-off', !state.on[i]);
      const t = titles[i];
      if (!t || state.on[i] === prevOn[i]) return;
      if (state.on[i]) {
        if (state.instant) showTyped(t);
        else typeIn(t, TITLE_MS);
      } else {
        resetTyping(t);
      }
    });
    prevOn = state.on.slice();
  };

  const set = (patch: Partial<typeof state>) => {
    Object.assign(state, patch);
    apply();
  };

  // where plates 2 and 3 sit when the stack is closed: directly under plate 1, one gap apart
  // Measured on the plates' untransformed parents, so the result is right even mid-transition.
  const measure = (): [number, number] => {
    const tops = plws.map((el) => (el.parentElement as HTMLElement).getBoundingClientRect().top + el.offsetTop);
    const g = (72 / 740) * plws[0].offsetWidth;
    return [tops[0] + g - tops[1], tops[0] + 2 * g - tops[2]];
  };

  // separate the plates; copy follows shortly after they start moving
  const open = () => {
    if (state.mode !== 'closed') return;
    if (dwell) { clearTimeout(dwell); dwell = 0; }
    const lag = window.matchMedia(NARROW).matches ? 380 : 60; // phone: wait until plates 2-3 clear the copy
    openAt = Date.now() + lag;
    set({ mode: 'open' });
    window.setTimeout(check, lag + 30);
  };

  // scrolling back up: fold the stack again and hide the copy
  const close = () => {
    if (state.mode !== 'open') return;
    const [t1, t2] = measure();
    set({ mode: 'closed', t1, t2, on: [false, false, false] });
  };

  // Layout above/inside the section can still change after init (web fonts, images, the phone's
  // address bar), so while the stack is closed its offsets are re-measured and snapped, never animated.
  const resync = () => {
    if (state.mode !== 'closed') return;
    const [t1, t2] = measure();
    if (Math.abs(t1 - state.t1) < 0.5 && Math.abs(t2 - state.t2) < 0.5) return;
    const wasInstant = state.instant;
    set({ t1, t2, instant: true });
    if (!wasInstant) requestAnimationFrame(() => requestAnimationFrame(() => { if (state.instant) set({ instant: false }); }));
  };

  function check() {
    resync();
    const vh = window.innerHeight || 800;
    const r = sec.getBoundingClientRect();
    if (lastTop != null && r.top !== lastTop) dir = r.top < lastTop ? 'down' : 'up';
    lastTop = r.top;
    const down = dir !== 'up';
    const p = plws[0].getBoundingClientRect();

    if (state.mode === 'closed') {
      if (r.bottom < 0) {
        // flew past it: jump to the final state, no late animation
        set({ mode: 'open', instant: true, on: [true, true, true] });
        requestAnimationFrame(() => set({ instant: false }));
        return;
      }
      // still scrolling on: never hold the reader back
      if (down && p.top < vh * 0.12) { open(); return; }
      // the closed stack must be fully on screen and stay there for a moment before it opens
      const inView = p.top >= 0 && p.bottom <= vh * 0.95;
      if (inView && down && !dwell) dwell = window.setTimeout(() => { dwell = 0; open(); }, 350);
      if ((!inView || !down) && dwell) { clearTimeout(dwell); dwell = 0; }
      return;
    }

    if (!down && p.top > vh * 0.45) { close(); return; }
    if (Date.now() < openAt) return;
    const on = state.on.slice();
    let changed = false;
    copies.forEach((c, i) => {
      if (!on[i] && c.getBoundingClientRect().top < vh * 0.92) { on[i] = true; changed = true; }
    });
    if (changed) set({ on });
  }

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; check(); });
  };

  const onResize = () => resync();

  const vh = window.innerHeight || 800;
  const r = sec.getBoundingClientRect();
  lastTop = r.top;
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  window.addEventListener('resize', onResize, { passive: true });

  // already reached or passed (anchor link, reload mid-page): stay in the final state
  if (r.top < vh * 0.12) return;

  const [t1, t2] = measure();
  set({ mode: 'closed', instant: true, t1, t2, on: [false, false, false] });
  requestAnimationFrame(() => requestAnimationFrame(() => { set({ instant: false }); check(); }));
  // re-measure once fonts and images have settled
  document.fonts?.ready.then(resync);
  window.addEventListener('load', resync, { once: true });
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => resync());
    copies.forEach((c) => ro.observe(c));
    plws.forEach((p) => ro.observe(p));
  }

  // cleanup for client-side navigation (Astro view transitions), if ever enabled
  document.addEventListener('astro:before-swap', () => {
    if (dwell) clearTimeout(dwell);
    document.removeEventListener('scroll', onScroll, { capture: true });
    window.removeEventListener('resize', onResize);
  }, { once: true });
}
