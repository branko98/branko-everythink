// The site's headline typing effect, shared by the scroll reveals (animations.ts)
// and sections that drive it themselves (engineering.ts).

type Typed = HTMLElement & { _tokens?: HTMLElement[]; _gen?: number; _caret?: HTMLElement };

/** Split an element's text into per-letter spans (words stay unbreakable). Idempotent. */
export function prepareTyping(el: HTMLElement): HTMLElement[] {
  const t = el as Typed;
  if (t._tokens) return t._tokens;
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
  t._tokens = tokens;
  return tokens;
}

/** Type the text in over `total` ms with a blinking caret. Runs once until reset. */
export function typeIn(el: HTMLElement, total = 1500) {
  const t = el as Typed;
  if (el.dataset.typed) return;
  el.dataset.typed = '1';
  const tokens = prepareTyping(el);
  const gen = (t._gen = (t._gen ?? 0) + 1);
  const step = Math.min(30, Math.max(8, total / tokens.length));
  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.setAttribute('aria-hidden', 'true');
  t._caret = caret;
  let i = 0;
  let last = performance.now();
  const tick = (now: number) => {
    if (t._gen !== gen) return; // reset while typing
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

/** Hide the text again so it can be typed in later. */
export function resetTyping(el: HTMLElement) {
  const t = el as Typed;
  const tokens = prepareTyping(el);
  t._gen = (t._gen ?? 0) + 1;
  t._caret?.remove();
  tokens.forEach((s) => s.classList.remove('on'));
  delete el.dataset.typed;
}

/** Show the full text immediately (no animation). */
export function showTyped(el: HTMLElement) {
  const t = el as Typed;
  if (!t._tokens) return; // never split: already plain, fully visible text
  t._gen = (t._gen ?? 0) + 1;
  t._caret?.remove();
  t._tokens.forEach((s) => s.classList.add('on'));
  el.dataset.typed = '1';
}
