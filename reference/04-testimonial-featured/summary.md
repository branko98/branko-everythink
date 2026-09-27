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

## Responsive

Izvučeno iz `styles-991.json`, `styles-767.json`, `styles-479.json`
(i `original-991/767/479.png`). Ključne razlike u odnosu na 1440:

### 991 (tablet)
- Container postaje fluid (`.container.w-container` → 951 px unutar 991
  viewport-a sa 20 px bočnog paddinga na sekciji).
- `.testimonial-grid` prelazi u **1 kolonu** (`grid-template-columns: 851px`).
  Sve tri ćelije (info-left, text, image-wrapper) se stack-uju vertikalno;
  logo/ime idu na vrh, citat u sredini, avatar na dnu (u originalu poravnat
  desno kroz `justify-content: flex-end` na image-wrapperu).
- Wrapper padding ostaje **50 px**. Definition wrapper zadržava
  `margin: 40px -50px 0` da izađe do ivica kontejnera.
- `.second-grid-testimonial-definition` postaje **4 kolone**
  (`128.4 / 256.8 / 128.4 / 327.4 px`) — i dalje sve četiri stavke u redu.
- Logo margin-bottom raste sa 0 na **20 px**.

### 767 (mobilni landscape)
- Container fluid, ~727 px.
- `.testimonial-grid` i dalje **1 kolona** (`grid-template-columns: 627px`).
- Wrapper padding ostaje 50 px, ali definition wrapper padding-right skače na
  **10 px** (`padding: 40px 10px 0px 50px`).
- Definition grid **2 kolone** (`235.3 / 411.7 px`) — INDUSTRY/DEFINITION u
  prvom redu, HEADQUARTERS/URL u drugom.

### 479 (mobilni portrait)
- Container ~439 px. Wrapper padding pada **50 → 25 px** horizontalno
  (`padding: 50px 25px`); vertikalno 50 ostaje.
- `.testimonial-grid` **1 kolona** (389 px).
- Definition wrapper margin postaje `30px -25px 0`, padding `30px 0 0 0`.
- Definition grid je i dalje 2-col, ali sada `1fr 1.75fr` (label kolona uža,
  vrednost šira). Vidi napomenu: svaki definition-item interno je flex-column
  gde su `div-block-330` (label) i vrednost slagani vertikalno unutar item-a.
- Ime dobija `margin-top: 15px` (odvaja ga vizuelno od avatara koji je
  iznad ili levo pri manjim širinama).

Napomena: Webflow patern je da testimonial-grid pada u 1-col već na 991.
Za moj dizajn ovo je razuman default; može se ostati na 3-col ispod 992
samo ako je container mnogo širi (nije naš slučaj — fluid ide ka 951).
