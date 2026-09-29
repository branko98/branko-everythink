const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** [[text]] → highlighted mark, **text** → bold. `variant` picks the highlight colour. */
export function rich(text: string, variant: 'blue' | 'red' = 'blue'): string {
  return esc(text)
    .replace(/\[\[(.+?)\]\]/g, `<mark class="hl hl--${variant}">$1</mark>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
