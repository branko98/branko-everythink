# 09-testimonial-list — ključne vrednosti

Izvor: https://www.omnius.so/geo-agency, selektor `.testimonial-wrapper` (nth=1;
prvi wrapper je featured 04, ostalo su list-item stila 09).
Box na live (nth=1, Authored Up primer): `x=163, y=457, w=1114, h=443`.
`.second-grid-testimonial-definition` unutar wrappera **se ne koristi** u 09 dizajnu.

## Wrapper

- `.testimonial-wrapper`: `padding: 50px`, `position: relative`, `margin: -2px -1px`
  (isto pravilo "priljubljivanja" na susedne wrapper-e kao 08-cta-dark).
- **`border-bottom: 1px dashed rgb(208, 213, 221)`** — linija ispod svakog testimonial-a
  (dolazi sa parent-a; sam wrapper root nema border-bottom u računatim stilovima,
  provera pokazuje da je linija na parent `.testimonials-list` ili sličnom).

## Leva "akcent" vertikalna linija

- **`<img class="testimonial-line large">`** — 2×26 px statička slika,
  `position: absolute`, na levoj ivici wrappera.
- Nije CSS border već raster/SVG slika.

## Struktura wrappera

- Grid `.testimonial-grid` (1014×172 px) — dve kolone: klijent info levo, citat desno.
- **Klijent info (levo):** logo + ime + uloga/kompanija (Inter mono style).
- **Citat (desno):** Geistmono paragraph sa highlight span-ovima.
- **Avatar (kraj):** `.testimonial-image-wrapper` sa krug slikom.
- **Case study link:** ispod citata, plav sa strelicom (šrelica je 6×6 div sa
  `border-top: 2px solid rgb(0, 110, 232)` + `border-right: 2px solid` — CSS ↗ chevron).

## Highlight u citatu

- **`<span class="testimonial-text-bold">`** — isti stil kao u 04:
  - Geistmono 700, 16px/25.6px, `background-color: rgb(224, 233, 255)`,
  - `color: rgb(15, 20, 31)`, bez padding-a.

## Definition row (ISKLJUČENA iz 09)

- Ispod citata dolazi `.second-grid-testimonial-definition` (INDUSTRY / DEFINITION /
  HEADQUARTERS / URL red), sa `border-top: 1px dashed rgb(208, 213, 221)` i
  `padding: 40px 0 0 50px`, `margin: 40px -50px 0 -50px`.
- U 09 dizajnu ovaj red **se ne prikazuje** — ako se koristi wrapper kao komponenta,
  filtrirati ovaj child.

## Fontovi

- Klijent ime: verovatno Inter 500-600, 20px+
- Klijent uloga: Geistmono 12-14px, uppercase, sivi.
- Citat: Geistmono 16px / 25.6px, weight 400.
- Highlight: Geistmono 700.

## Animacije

- Highlight span-ovi verovatno animiraju scroll-om (isto kao 04, Webflow IX2).
*(vrednosti animacija nisu izvučene)*
