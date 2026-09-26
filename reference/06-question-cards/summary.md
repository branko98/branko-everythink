# 06-question-cards — ključne vrednosti

Izvor: https://www.omnius.so/programmatic-seo, selektor `.container.container-flex`.
Box na live: `x=163, y=647, w=1114, h=1154`.

## Grid kartica

- Unutar `.container.container-flex` je `.w-layout-grid`:
  - `grid-template-columns: 370.656px 370.672px 370.656px` (3 kolone)
  - `grid-template-rows: 391px 391px 372px` (3 reda)
- Original ima **3 kartice**, moja verzija **4** — struktura reda može biti
  stepenasta (jedna kartica po redu na različitim kolonama).

## Kartica (`.programmatic-card`)

- `display: flex; flex-direction: column; align-items: flex-start`
- `padding: 24px` (varira do `24px 24px 32px 24px`)
- Modifikatori za ivice: `.top-border`, `.right-border`, `.bottom-border`,
  `.left-border` — svaki daje `1px dashed rgb(208, 213, 221)` na odgovarajuću stranu.
- Kombinacija modifikatora određuje kojim stranama je "zatvorena" kartica.

## **Corner markers (kvadratići na uglovima)**

- **`<div class="square-small-edge">`** — 5 instanci u sekciji.
- Svaki: `12×12 px`, `position: absolute`,
  `background-color: rgb(30, 33, 36)` (crni), bez border-a.
- Postavljen apsolutno na ugao kartice (npr. `x=158, y=-6` u odnosu na kartici).
- Preklapa dashed liniju kartice — pravi utisak "spajanja" dve dashed linije u tački.

## Connector linije između kartica

- **`<div class="line-vertical">`** — 3 instance u sekciji.
- Dimenzije: `2×390 px`, `position: absolute`,
  `background-color` — proveriti (verovatno tamna).
- Povezuje ivice susednih kartica; služi kao vizuelni "put" kroz stepenasti raspored.

## Linije oko sekcije

- Iznad/ispod pojedinačnih kartica: dashed (od `.programmatic-card` modifikatora).
- Vertikalne dashed linije oko cele sekcije: containeri iz 00-global.

## Fontovi

- Naslov kartice: proveriti u tree — verovatno `Alliance` ili `Inter` semibold.
- Body kartice: `Inter, Arial, sans-serif`, `14px`, `line-height: 20px`,
  `color: rgb(30, 33, 36)`.
- Podebljanje unutar body-a je Inter 600/700 span.

## Napomena

Corner markeri i vertical linije za spajanje **postoje na Omnius originalu**
(nisu moj dodatak) — samo su jedva vidljivi u malom preview-u zbog 1-2 px veličine.
