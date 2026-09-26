# Reference — mapa sekcija

## Pravila

- `design.png` (moj dizajn) određuje **ŠTA** postoji, raspored i sadržaj.
  Kada se razlikuje od originala, **design.png pobeđuje**.
- Original sa Omnius-a služi **samo** za tačne vrednosti: fontovi, razmaci,
  linije, boje, stil komponenti.
- Sav tekst, logotipi i imena klijenata u dizajnu su **PLACEHOLDER**.

## Razmera (design ↔ live)

- `design-full.png` je širok **3132 px**.
- Sajt snimamo na viewport-u **1440 × 900** (headless, bez scrollbara).
- Container u dizajnu meri **2226 px** (leva dashed linija na x=447.5,
  desna na x=2673.5 u `design-full.png`).
- Container na live meri **1114 px** (`.container.w-container`).
- **Razmera dizajn → live: 2226 / 1114 = 1.998 (praktično ×2).**
- Vratno: 1 px na live ≈ 2 px u `design-full.png`.

## Redosled sekcija

Redosled ispod je redosled na sajtu.

Y-opsezi su u punoj rezoluciji `design-full.png` (3132×11458 px), oblik
`y: start..end (h=visina)`.

### 00-header
- y: 0..130 (h=130)
- Izvor: https://www.omnius.so
- Element: glavna navigacija na vrhu.

### 01-hero
- y: 130..887 (h=757)
- Naslov: https://www.omnius.so, selektor `.main-heading-grid`
  (razmak iznad dolazi iz `.below-nav-container`).
- Podnaslov: https://www.omnius.so/content-marketing, selektor
  `.hero-grid.light-theme.without-grid`.

### 02-case-study
- y: 887..1386 (h=499)
- Izvor: https://www.omnius.so
- Selektor: `.section.graph-section`.

### 03-stats
- y: 1386..1812 (h=426)
- Izvor: https://www.omnius.so/programmatic-seo
- Selektor: `.stats-grid-4-cols`.

### 04-testimonial-featured
- y: 1812..3784 (h=1972)
- Izvor: https://www.omnius.so/geo-agency
- Unutar `.section-omar.middle-section`, element
  `[data-w-id="f8e998fe-cee6-c8ce-f335-f4becaabef63"]`.

### 05-section-heading
- y: 3784..4426 (h=642)
- Izvor: https://www.omnius.so/programmatic-seo
- Selektor: `.heading-grid`.

### 06-question-cards
- y: 4426..6836 (h=2410)
- Izvor: https://www.omnius.so/programmatic-seo
- Selektor: `.container.container-flex` (uopštena klasa — prepoznati po
  izgledu: kartice sa pitanjima raspoređene stepenasto po gridu).
- Moja verzija ima **4 kartice**, original **3** — gradi se po mom dizajnu,
  original služi samo za stil.

### 07-good-bad-table
- y: 6836..8650 (h=1814)
- Nema izvor — gradi se **iz tokena**.

### 08-cta-dark
- y: 8650..10190 (h=1540)
- Izvor: https://www.omnius.so
- Selektor: `.cta-wrapper.gradient-background.cta-height.dark-mode-cta-new-style`.

### 09-testimonial-list
- y: 10190..11458 (h=1268)
- Izvor: https://www.omnius.so/geo-agency
- Selektor: `.testimonial-wrapper` (bez elementa
  `.second-grid-testimonial-definition`).
