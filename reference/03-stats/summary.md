# 03-stats — ključne vrednosti

Izvor: https://www.omnius.so/programmatic-seo, selektor `.stats-grid-4-cols`.
Box na live: `x=164, y=4881, w=1112, h=153`.

## Grid

- `display: grid`
- `grid-template-columns: 278px 278px 278px 278px` (4 kolone jednake širine)
- `grid-template-rows: 153.312px`

## Razdelnici (vertikalne linije između statistika)

- Svaki `.stat-grid-item` ima **`border-right: 1px dashed rgb(208, 213, 221)`**.
- Poslednja kolona ima modifikator `.right-border-none` (u praksi taj override
  nije aktivan na ovom viewportu — svi item-i imaju desnu bordu; prilagoditi po potrebi).

## Item

- `.stat-grid-item`: width `278px`, height `153.312px`, `padding: 30px`, `position: relative`.
- Sadrži `.stat-wrapper` (visina 93, širina 217) sa `stat-number` (velik broj),
  labelu i `<img>` piksel-ikonu.

## Horizontalne linije

- Nema izraženih border-top/bottom na samoj gridi.
- Iznad/ispod (razmak pre i posle sekcije) je bela pozadina; horizontalne
  dashed linije koje se vide na dizajnu dolaze iz drugih elemenata (susednih sekcija).

## Fontovi

- `font-family: Inter, Arial, sans-serif`, `font-size: 14px`, `line-height: 20px`,
  `color: rgb(30, 33, 36)` (glavni tekst grida).
- `.stat-number` — proveri unutar tree; verovatno Alliance ili Inter u većem sizeu.

## Responsive (iz `styles-991/767/479.json` i `original-991/767/479.png`)

- **991**: 4 kolone fluid (`237.25px × 4`), item height 153.312, `stat-number` 30/38.
  Vertikalne dashed linije između kolona ostaju (border-right na items 1–3).
- **767**: **2×2 grid** (`362.5px × 2`, rows `133.156px × 2`), padding item 30.
  Dashed vertikalna između kolona (border-right na levom item-u u redu). Nema
  horizontalne dashed linije između redova.
- **479**: **1 kolona** (`grid-template-columns: 1fr`, `auto` rows), padding 30,
  `stat-number` 26/38. Bez vertikalnih dashed linija između item-ova (samo
  container). Poslednji item ima donji padding 80 (extra vazduh) — u našem
  slučaju držimo standardnih 30, jer je to margin unutar sekcije.
- Crni marker (`|`, 2×26 crn) ostaje na svim širinama u gornjem levom uglu
  `.stat-wrapper` (position: absolute na item-u).
