# 00-header — ključne vrednosti

Izvor: https://www.omnius.so, selektor `.white-navbar`.
Full detalje vidi u `styles.json` (`.white-navbar` na 1440).

## Sažetak

- Visina header-a **70 px** (`.white-navbar` height).
- Padding `0 20px`.
- Sadržaj: brand levo, dropdown-links (4 stavke) u sredini, "Get started" CTA desno.
- Container unutar navbar-a: `.header-container.white.w-container` — 1114 × 70,
  `display: flex`, `justify-content: flex-start`, `align-items: center`,
  dashed leva/desna 1 px, margin `0 143`.

## Responsive

Snimljeno na 991×900, 767×900, 479×900, 1920×900. Fajlovi:
`original-991.png`, `styles-991.json`, itd.

### Visina i padding — **nema promene**

| Viewport | `.white-navbar` box | Padding |
|---:|---:|---:|
| 1920 | 1920 × **70** | `0 20px` |
| 1440 | 1440 × **70** | `0 20px` |
| 991  |  991 × **70** | `0 20px` |
| 767  |  767 × **70** | `0 20px` |
| 479  |  479 × **70** | `0 20px` |

### Navigacione stavke

| Viewport | `.dropdown-links` (4 stavke) | Hamburger `.w-nav-button` | CTA `.cta-button.white` |
|---:|:---:|:---:|:---:|
| 1920 | vidljivo (flex, 419 × 28) | nema | vidljivo (116 × 35) |
| 1440 | vidljivo (flex, 419 × 28) | nema | vidljivo (116 × 35) |
| 991  | **display: none**  | **display: block, 60 × 60** | vidljivo (116 × 35) |
| 767  | **display: none**  | **display: block, 60 × 60** | vidljivo (116 × 35) |
| 479  | **display: none**  | **display: block, 60 × 60** | vidljivo (116 × 35) |

- Breakpoint za hamburger: **≤ 991** (menja se između 1440 i 991).
- Hamburger dugme je **60 × 60 px** (Webflow default `.w-nav-button`),
  pozicioniran u desnom uglu unutar `.white-navbar`.
- CTA dugme **ostaje vidljivo na svim širinama** — nikad se ne krije.
