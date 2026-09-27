# 02-case-study — ključne vrednosti

Izvor: https://www.omnius.so, selektor `.section.graph-section`.
Box na live: `x=0, y=416, w=1440, h=324` (full-width sekcija, unutar container 1112).

## Grafikon

- **`<img class="image-8 graph-line">`** — statična raster slika grafika (**689×220 px**).
- Roditelj `.hero-slider-image-wrapper` (`position: relative`, `689×220`).
- Preko slike `<div class="picture-overlay">` sa `background-color: rgb(255, 255, 255)`,
  `position: absolute`, iste dimenzije — koristi se za reveal animaciju (kliži da otkrije grafik).
- **Vertikalne linije unutar grafika su deo raster slike** — nisu odvojeni CSS/SVG elementi.

## Kartica grafika

Roditelj `.w-slider` element ima:
- `border: 1px solid rgb(234, 236, 240)` (svih 4 strane)
- `border-radius: 12px`
- `margin: 0 -1px 24px -1px`

## Horizontalne linije

- Nema izraženih border-top/bottom na samoj sekciji.
- Vertikalne dashed linije oko sadržaja dolaze iz container-a
  (`.container` sa `border-left/right: 1px dashed rgb(208, 213, 221)` iz 00-global).

## Sadržaj sekcije

Slider sa više slajdova (5 grupa): svaki slajd ima tag chip
("Fintech", "AI / LLM SaaS", …), veliki naslov procenta i mali logo/napomenu.

## Animacije

- Reveal grafika (`.picture-overlay` sa animacijom).
- Slider (auto/manual, `.w-slider`), sa `<`/`>` navigacijom.

*(vrednosti animacija nisu izvučene — samo napomena)*

## Responsive

Snimljeno na 991×900, 767×900, 479×900, 1920×900. Fajlovi:
`original-991.png`, `styles-991.json`, itd.

| Viewport | Section (`.graph-section`) | Card (`.slider-3`) | Wrapper padding | `.hero-slider` flex-dir | Content-wrap | Image-wrap |
|---:|---:|---:|---:|:---:|---:|---:|
| 1920 | 1920 × 324 | 1114 × 300 | 40 px | **row** | 250 × 220 | 689 × 220 |
| 1440 | 1440 × 324 | 1114 × 300 | 40 px | **row** | 250 × 220 | 689 × 220 |
|  991 |  991 × 324 |  951 × 300 | 40 px | **row** | 238 × 220 | 553 × 220 |
|  767 |  767 × 324 |  727 × 300 | 40 px | **row** | 215 × 220 | 372 × 220 |
|  479 |  479 × **476** |  439 × **452** | **25 px** | **column** | 270 × 244 | 387 × 156 |

### Šta se menja

- **479 (mobilni uspravno)** je jedini pravi lom:
  - `.hero-slider` prelazi u **`flex-direction: column`** — tekst iznad grafika (ne pored).
  - Padding kartice pada **40 → 25 px**.
  - Sekcija i kartica postaju **znatno više** (324 → 476, 300 → 452) jer se sadržaj slaže vertikalno.
  - Grafikon postaje **niži** (220 → 156) i **fluid** po širini.
- Na 991 i 767 layout ostaje **row** (tekst levo, grafikon desno), ali kartica
  postaje fluid i grafikon se sužava (689 → 553 → 372) — vertikalne linije
  grafika (koje su na omnius-u deo raster slike) se skaliraju.
- `border-radius: 12px` i solid border ostaju na svim širinama.
- **Iznad 1440 (1920)** — ništa se ne menja, kartica ostaje 1114 × 300.
- Strelice slider-a (`.left-arrow-2` / `.right-arrow-2`) ostaju
  vidljive na svim širinama (mi ih ne renderujemo — nebitno za našu
  implementaciju).
