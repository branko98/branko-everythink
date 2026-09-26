// Uniform DOM extractor.
// Meant to be executed inside a page via Playwright's page.evaluate.
// Usage from Node:
//   const src = fs.readFileSync('reference/_tools/extract.js','utf8');
//   const data = await page.evaluate(({src, selector}) => {
//     eval(src);                     // defines window.__extract
//     return window.__extract(selector);
//   }, { src, selector: '.main-heading-grid' });
//
// Returns: { selector, matchCount, index, chosen, parents, tree, pseudo, fonts, viewport }

(function () {
  const MAX_DEPTH = 8;
  const MAX_TEXT = 80;

  const TRACKED = [
    'display', 'position',
    'width', 'max-width', 'height',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'gap', 'row-gap', 'column-gap',
    'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row',
    'flex-direction', 'justify-content', 'align-items',
    'border-top-width', 'border-top-style', 'border-top-color',
    'border-right-width', 'border-right-style', 'border-right-color',
    'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
    'border-left-width', 'border-left-style', 'border-left-color',
    'border-top-left-radius', 'border-top-right-radius',
    'border-bottom-left-radius', 'border-bottom-right-radius',
    'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
    'text-transform',
    'color', 'background-color', 'background-image',
  ];

  // Values considered "default/empty" — drop from output.
  const DEFAULTS = new Set([
    '', 'auto', 'normal', 'none', '0px', '0%',
    'rgba(0, 0, 0, 0)', 'transparent',
    'medium', 'currentcolor',
  ]);

  function isDefault(prop, value) {
    if (value == null) return true;
    if (DEFAULTS.has(value)) return true;
    // border shorthand defaults
    if (prop.startsWith('border-') && prop.endsWith('-style') && value === 'none') return true;
    if (prop.startsWith('border-') && prop.endsWith('-width') && value === '0px') return true;
    // font defaults
    if (prop === 'font-weight' && value === '400') return true;
    if (prop === 'font-style' && value === 'normal') return true;
    return false;
  }

  function collapseBorders(styles) {
    // Combine per-side border-*-{width,style,color} into a single "border-<side>": "1px solid rgb(...)"
    const sides = ['top', 'right', 'bottom', 'left'];
    for (const side of sides) {
      const w = styles[`border-${side}-width`];
      const s = styles[`border-${side}-style`];
      const c = styles[`border-${side}-color`];
      if (w || s || c) {
        // Only emit if any of them is meaningful
        if ((w && w !== '0px') || (s && s !== 'none')) {
          styles[`border-${side}`] = [w || '', s || '', c || ''].filter(Boolean).join(' ').trim();
        }
        delete styles[`border-${side}-width`];
        delete styles[`border-${side}-style`];
        delete styles[`border-${side}-color`];
      }
    }
    // Combine border-radius corners into shorthand when all equal / symmetric.
    const r = {
      tl: styles['border-top-left-radius'],
      tr: styles['border-top-right-radius'],
      bl: styles['border-bottom-left-radius'],
      br: styles['border-bottom-right-radius'],
    };
    const anyRadius = Object.values(r).some(v => v && v !== '0px');
    if (anyRadius) {
      if (r.tl === r.tr && r.tr === r.bl && r.bl === r.br) {
        styles['border-radius'] = r.tl;
      } else {
        styles['border-radius'] = `${r.tl || '0px'} ${r.tr || '0px'} ${r.br || '0px'} ${r.bl || '0px'}`;
      }
      delete styles['border-top-left-radius'];
      delete styles['border-top-right-radius'];
      delete styles['border-bottom-left-radius'];
      delete styles['border-bottom-right-radius'];
    }
    // Padding shorthand
    const p = [
      styles['padding-top'], styles['padding-right'],
      styles['padding-bottom'], styles['padding-left'],
    ];
    if (p.some(v => v && v !== '0px')) {
      const [t, ri, b, l] = p.map(v => v || '0px');
      if (t === ri && ri === b && b === l) styles['padding'] = t;
      else if (t === b && ri === l) styles['padding'] = `${t} ${ri}`;
      else styles['padding'] = `${t} ${ri} ${b} ${l}`;
      delete styles['padding-top']; delete styles['padding-right'];
      delete styles['padding-bottom']; delete styles['padding-left'];
    }
    // Margin shorthand
    const m = [
      styles['margin-top'], styles['margin-right'],
      styles['margin-bottom'], styles['margin-left'],
    ];
    if (m.some(v => v && v !== '0px')) {
      const [t, ri, b, l] = m.map(v => v || '0px');
      if (t === ri && ri === b && b === l) styles['margin'] = t;
      else if (t === b && ri === l) styles['margin'] = `${t} ${ri}`;
      else styles['margin'] = `${t} ${ri} ${b} ${l}`;
      delete styles['margin-top']; delete styles['margin-right'];
      delete styles['margin-bottom']; delete styles['margin-left'];
    }
    return styles;
  }

  function pickStyles(el, pseudo) {
    const cs = getComputedStyle(el, pseudo || null);
    const out = {};
    for (const prop of TRACKED) {
      const v = cs.getPropertyValue(prop).trim();
      if (!isDefault(prop, v)) out[prop] = v;
    }
    return collapseBorders(out);
  }

  function pseudoInfo(el, name) {
    const cs = getComputedStyle(el, name);
    const content = cs.getPropertyValue('content');
    const display = cs.getPropertyValue('display');
    if (display === 'none') return null;
    if (content === 'none' || content === 'normal' || content === '') return null;
    const styles = pickStyles(el, name);
    styles['content'] = content;
    return styles;
  }

  function directText(el) {
    let s = '';
    for (const n of el.childNodes) {
      if (n.nodeType === Node.TEXT_NODE) s += n.nodeValue;
    }
    s = s.replace(/\s+/g, ' ').trim();
    if (!s) return undefined;
    return s.length > MAX_TEXT ? s.slice(0, MAX_TEXT - 1) + '…' : s;
  }

  function classList(el) {
    return el.classList && el.classList.length ? Array.from(el.classList) : undefined;
  }

  function box(el) {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.left),
      y: Math.round(r.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  }

  function isHidden(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return true;
    return false;
  }

  function nodeDump(el, depth) {
    if (!el || el.nodeType !== 1) return null;
    if (isHidden(el)) return null;
    const dump = {
      tag: el.tagName.toLowerCase(),
      classes: classList(el),
      box: box(el),
      text: directText(el),
      styles: pickStyles(el),
    };
    const before = pseudoInfo(el, '::before');
    const after = pseudoInfo(el, '::after');
    if (before) dump.before = before;
    if (after) dump.after = after;
    if (depth < MAX_DEPTH) {
      const children = [];
      for (const c of el.children) {
        const cd = nodeDump(c, depth + 1);
        if (cd) children.push(cd);
      }
      if (children.length) dump.children = children;
    }
    return dump;
  }

  function parentChain(el) {
    const chain = [];
    let cur = el.parentElement;
    while (cur) {
      chain.push({
        tag: cur.tagName.toLowerCase(),
        classes: classList(cur),
        box: box(cur),
        styles: pickStyles(cur),
      });
      if (cur.tagName.toLowerCase() === 'section') break;
      cur = cur.parentElement;
    }
    return chain;
  }

  function fontsUsed() {
    if (!document.fonts) return [];
    const out = [];
    for (const f of document.fonts) {
      if (f.status === 'loaded') {
        out.push({
          family: f.family && f.family.replace(/^["']|["']$/g, ''),
          weight: f.weight,
          style: f.style,
          stretch: f.stretch,
          unicodeRange: f.unicodeRange,
        });
      }
    }
    return out;
  }

  window.__extract = function (selector, index) {
    const list = document.querySelectorAll(selector);
    const matchCount = list.length;
    let el = null, idx = -1;
    if (matchCount > 0) {
      idx = typeof index === 'number' ? index : 0;
      el = list[idx] || null;
    }
    return {
      selector,
      matchCount,
      index: idx,
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      fonts: fontsUsed(),
      chosen: el ? {
        tag: el.tagName.toLowerCase(),
        classes: classList(el),
        box: box(el),
      } : null,
      parents: el ? parentChain(el) : [],
      tree: el ? nodeDump(el, 0) : null,
    };
  };
})();
