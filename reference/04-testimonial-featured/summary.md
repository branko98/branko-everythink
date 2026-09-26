# 04-testimonial-featured — ključne vrednosti

Izvor: https://www.omnius.so/geo-agency, selektor
`[data-w-id="f8e998fe-cee6-c8ce-f335-f4becaabef63"]`
(to je unutar `.section-omar.middle-section`, prvi `.testimonial-wrapper`).
Box na live: `x=163, y=7657, w=1114, h=854`.

## Struktura

- **Levi stub:** logo klijenta, ime, uloga.
- **Desni stub:** dugi citat (Geistmono) preko više paragrafa.
- **Ispod:** `.second-grid-testimonial-definition` — red **INDUSTRY / DEFINITION /
  HEADQUARTERS / URL** (odvojen `border-top: 1px dashed rgb(208, 213, 221)`).

## Citat

- Kontejner `.testimonial-paragraph.service.testimonial-big.text-resize`:
  `font-family: Geistmono, sans-serif`, `font-size: 16px`, `line-height: 25.6px`,
  weight `400`, `color: rgb(15, 20, 31)`.

## Highlight u citatu

- **`<span class="testimonial-text-bold">`**
- `font-family: Geistmono, sans-serif`
- `font-size: 16px`, `font-weight: 700`, `line-height: 25.6px`
- `background-color: rgb(224, 233, 255)` — svetlo plava
- `color: rgb(15, 20, 31)`
- Bez padding-a (background priljubljen uz tekst)
- Više highlight span-ova unutar jednog citata.

## Linije

- **Border-top na `.second-grid-testimonial-definition`**: `1px dashed rgb(208, 213, 221)`.
- Sam wrapper nema border-top/bottom; leve/desne dashed linije dolaze iz containera
  (00-global).
- Levi mali vertikalni akcent u dizajnu (2×26 px) — proveriti da li se generiše
  ovde (nije jasno iz styles.json — verovatno je `.testimonial-line` klasa
  isto kao u 09).

## Slika autora

- `.testimonial-image-wrapper` na desnoj strani (avatar).

## Animacije

- Highlight span-ovi po scroll-u dobijaju animaciju (Webflow IX2 —
  `data-w-id` na wrapperu). Nije izvučeno.
