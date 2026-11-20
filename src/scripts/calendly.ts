// Every link to calendly.com (all "Book a call" buttons) opens Calendly's popup scheduler
// instead of leaving the site. Calendly's files load on first use, so pages stay fast.
// If the script can't load, the link simply opens Calendly normally.

declare global {
  interface Window { Calendly?: { initPopupWidget: (o: { url: string }) => void } }
}

let loading: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.async = true;
    js.onload = () => resolve();
    js.onerror = () => { loading = null; reject(new Error('Calendly failed to load')); };
    document.head.appendChild(js);
  });
  return loading;
}

const isCalendly = (a: HTMLAnchorElement) => /(^|\.)calendly\.com$/.test(a.hostname);

// warm up on hover/focus so the popup opens instantly on click
['pointerover', 'focusin'].forEach((type) =>
  document.addEventListener(type, (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
    if (a && isCalendly(a)) loadCalendly().catch(() => {});
  }, { passive: true })
);

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
  if (!a || !isCalendly(a) || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  loadCalendly()
    .then(() => window.Calendly!.initPopupWidget({ url: a.href }))
    .catch(() => window.open(a.href, '_blank', 'noopener'));
});

export {};
