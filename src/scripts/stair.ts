// The staircase line: one continuous path from the first square, through every square,
// down to the "This works…" headline. Its drawn length follows the scroll position
// (scrubbed, both directions). Squares are static; only the line moves.

const ROWS = [275, 552, 797, 1070, 1325];
const DESKTOP = '(min-width: 900px)';
// Pen position: the line's tip tracks this fraction of the viewport height.
const PEN = 0.62;
// Horizontal runs take less scrolling than vertical ones, so the tip stays near the pen.
const H_COST = 0.35;

type Pt = [number, number];

function points(stair: HTMLElement): Pt[] {
  const w = stair.clientWidth;
  const h = stair.clientHeight;
  if (!window.matchMedia(DESKTOP).matches) return [[0, 0], [0, h]];
  const c1 = w / 3;
  const c2 = (2 * w) / 3;
  const [r1, r2, , r4, r5] = ROWS;
  return [
    [0, 0], [0, r1], [c1, r1], [c1, r2], [c2, r2], [c2, r4], [c1, r4], [c1, r5], [0, r5], [0, h],
  ];
}

function setup(stair: HTMLElement) {
  const svg = stair.querySelector<SVGSVGElement>('.stair__path');
  const path = svg?.querySelector('path');
  if (!svg || !path) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let segs: { len: number; cost: number }[] = [];
  let total = 0;
  let totalCost = 0;

  const layout = () => {
    const pts = points(stair);
    svg.setAttribute('viewBox', `0 0 ${stair.clientWidth} ${stair.clientHeight}`);
    path.setAttribute('d', 'M' + pts.map((p) => p.join(' ')).join(' L'));
    segs = pts.slice(1).map((p, i) => {
      const dx = Math.abs(p[0] - pts[i][0]);
      const dy = Math.abs(p[1] - pts[i][1]);
      return { len: dx + dy, cost: dy + dx * H_COST };
    });
    total = segs.reduce((a, s) => a + s.len, 0);
    totalCost = segs.reduce((a, s) => a + s.cost, 0);
    path.style.strokeDasharray = `${total} ${total + 10}`;
    draw();
  };

  const draw = () => {
    if (reduce.matches) {
      path.style.strokeDashoffset = '0';
      return;
    }
    const r = stair.getBoundingClientRect();
    const travelled = Math.min(Math.max(window.innerHeight * PEN - r.top, 0), r.height);
    let budget = (travelled / r.height) * totalCost;
    let drawn = 0;
    for (const s of segs) {
      if (budget >= s.cost) {
        drawn += s.len;
        budget -= s.cost;
      } else {
        drawn += s.cost ? (budget / s.cost) * s.len : 0;
        break;
      }
    }
    path.style.strokeDashoffset = String(total - drawn);
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      draw();
    });
  };

  layout();
  window.addEventListener('scroll', onScroll, { passive: true });
  new ResizeObserver(layout).observe(stair);
  reduce.addEventListener('change', draw);
}

document.querySelectorAll<HTMLElement>('[data-stair]').forEach(setup);
