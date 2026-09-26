# 08-cta-dark — ključne vrednosti

Izvor: https://www.omnius.so, selektor
`.cta-wrapper.gradient-background.cta-height.dark-mode-cta-new-style`.
Box na live: `x=164, y=6316, w=1112, h=580`.

## Pozadina

- **`background-color: rgb(30, 33, 36)`** — solidna tamna (skoro crna).
- **Nema `background-image` ni linear-gradient u computed style** — bez obzira
  na klasu `.gradient-background`, na live rendering-u je čista solidna boja.
  (Klasa je verovatno legacy naziv ili je override na drugom breakpoint-u.)

## Border-i (horizontalne linije)

- **`border-top: 1px dashed rgb(208, 213, 221)`**
- **`border-bottom: 1px dashed rgb(208, 213, 221)`**
- `margin: -2px 0px` — wrapper se povlači 2 px u sekcije iznad i ispod
  (da bi dashed border legao tačno preko dashed linija okolnih containera).

## Layout

- `display: flex; flex-direction: column; justify-content: center; align-items: flex-start`
- `padding: 64px 130px`
- Sadrži logo (`<img class="image-cta-animation dark-mode-cta">` 40×40, gore levo),
  velik naslov (rotator "SaaS / Fintech / AI …"), opis, dva CTA button-a, i pod
  njima red logotipa.

## Red logotipa ("pilule")

- Kontejner: flex row sa `gap: 6px`.
- Svaki pill `.our-work-pill`:
  - `width ~122px`, `height: 28.4531px`
  - `padding: 4px 10px`
  - `border: 1px solid rgb(52, 55, 58)` (tamno-siva u odnosu na CTA pozadinu)
  - `border-radius: 6px`
  - `background-color`: transparent (bez override-a, znači paus vrednost)
  - `color: rgb(254, 254, 254)` (beli tekst)
  - Unutar: `<img class="image-gradient-pill">` 14×14 (mala ikona) + naziv brenda.

## CTA button-i

- Ispod naslova, "Contact our team" (solidan svetli) i "Schedule a meeting"
  (tamniji sa avatar-om). Provera stila u tree.

## Fontovi

- Naslov CTA: proveri tree — velik, verovatno Inter 500-600.
- Body: `Inter, Arial, sans-serif, 16px/20px`, `color: rgb(254, 254, 254)`.

## Animacije

- Naslov ima "rotator" (izmena reči SaaS → Fintech → AI) — verovatno Webflow-ov
  slider (`.rotators-wrapper`).
- `image-cta-animation` klasa sugeriše animiranu ikonu.
*(vrednosti animacija nisu izvučene)*
