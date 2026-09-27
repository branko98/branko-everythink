# 05-section-heading — ključne vrednosti

Izvor: https://www.omnius.so/programmatic-seo, selektor `.heading-grid`.
Box na live: `x=164, y=..., w=1112, h=205.5`.

## Grid

- `display: grid`
- `grid-template-columns: 742px 370px` (2 kolone: veliki naslov levo, kratak tekst/CTA desno)
- `grid-template-rows: 205.5px`

## Naslov (levo)

- `font-family: **Alliance**, sans-serif`
- `font-size: 36.7px`
- `font-weight: 600`
- `line-height: 51.38px`
- `letter-spacing: -1.28px`
- `color: rgb(15, 20, 31)`

## Linije

- Nijedna vidljiva horizontalna linija u samom `.heading-grid`.
- Vertikalne dashed linije oko sadržaja dolaze iz containera (00-global).
- U roditeljima (parent chain) nalazi se `border-left/right: 1px dashed`
  (containeri) i `border-bottom: 1px dashed rgb(208, 213, 221)` na neposrednom
  parent-u (`.container` sekcije heading-a) — to je linija ispod naslova.

## Napomena

Struktura je vrlo jednostavna — jedan `<h2>` levo, opcioni prateći tekst/CTA desno.
Cela sekcija u dizajnu ima veliki gornji razmak; taj razmak dolazi iz parent
containera i padding-a sekcije, ne iz samog `.heading-grid`.

## Responsive (iz `styles-991/767/479.json` i `original-991/767/479.png`)

- **991**: grid postaje **1 kolona** (aside sklopljen). Naslov ostaje 36.7/51.38.
  Širina teksta 712 (fluid).
- **767**: 1 kolona, isti font 36.7/51.38.
- **479**: 1 kolona, naslov pada na **27/42** (`letter-spacing -1.28` ostaje).
- Bez horizontalnog dashed border-a između sekcija — sopstveni `bottom-border`
  container-a je dovoljan.
