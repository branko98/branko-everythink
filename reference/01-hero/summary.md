# 01-hero — ključne vrednosti

Dva odvojena izvora:
- **Naslov** (`.main-heading-grid`) sa https://www.omnius.so — `styles-heading.json` / `original-heading.png`.
- **Podnaslov** (`.hero-grid.light-theme.without-grid`) sa
  https://www.omnius.so/content-marketing — `styles-subtitle.json` / `original-subtitle.png`.

Razmak iznad naslova dolazi od `.below-nav-container` (definisan u 00-global).

## Naslov (na 1440)

- Container `.main-heading-grid`: 1112 × 144, grid 2-col **834 / 278 px**
  (leva kolona `.hero-text` drži h1, desna `.hero-empty-block` prazna sa
  dashed `border-left`).
- `h1.main-heading`: font Alliance 600, **35.7 / 48 px**, tracking **−1.2 px**,
  color `rgb(30, 33, 36)`.

## Podnaslov (na 1440)

- Container `.hero-grid.light-theme.without-grid`: 1112 × 148, grid **3 × 370.66 px**.
- Leva kolona `.hero-content-wrapper` sa `padding-top: 70 px` drži `<p>`.
- `p.content-paragraph`: font Inter, **16 / 26**, tracking **−0.14 px**,
  širina ~333 px, margin-right ~37 px (u 3-col varijanti).

## Responsive

Snimljeno na 991×900, 767×900, 479×900, 1920×900.

### Naslov (`.main-heading-grid`)

| Viewport | Grid | `main-heading-grid` box | `h1` font / line / tracking |
|---:|:---|---:|:---|
| 1920 | 834 / 278 px | 1112 × 144 | 35.7 / 48 / −1.2 |
| 1440 | 834 / 278 px | 1112 × 144 | 35.7 / 48 / −1.2 |
|  991 | **781 / 167 px** (fluid) | 949 × 144 | **33** / 48 / −1.2 |
|  767 | **597 / 128 px** (fluid) | 725 × 192 | 33 / 48 / −1.2 |
|  479 | **1fr** (jedna kolona — desni prazan blok se sklapa/nema mesta) | 437 × 195 | **26** / **39** / **−1** |

- Grid ostaje 2-kolona iznad 479, sa proporcijom cca 82/18 na 1440 i 991.
- Na **479 postaje 1-kolona** — desni `.hero-empty-block` više nije samostalna
  ćelija u gridu.
- H1 font pada **35.7 → 33 → 33 → 26** na 1440 / 991 / 767 / 479.
- Line-height pada **48 → 39** samo na 479. Tracking **−1.2 → −1** na 479.
- Visina raste jer se h1 prelama na više redova pri užem gridu.

### Podnaslov (`.hero-grid.light-theme.without-grid`)

| Viewport | Grid | wrapper padding-top | `p` font / line | `p` width |
|---:|:---|---:|:---|---:|
| 1920 | 3 × 370.66 px | 70 px | 16 / 26 | 334 px |
| 1440 | 3 × 370.66 px | 70 px | 16 / 26 | 334 px |
|  991 | **1fr** (jedna kolona) | 70 px | 16 / 26 | 854 px |
|  767 | **1fr** | 70 px | 16 / 26 | 653 px |
|  479 | **1fr** | **50 px** | **15 / 24.375** | 393 px |

- Ispod 991 grid pada sa **3-col na 1-col**; srednja i desna vertikalna dashed
  linija se gube.
- Padding-top pada **70 → 50** samo na 479.
- Font pada **16 → 15** i line **26 → 24.375** samo na 479.
- Iznad 1440 (1920) — **ništa se ne menja**, container ostaje 1114 sa istim 3-col gridom.
