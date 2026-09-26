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
