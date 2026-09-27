# 00-global — ključne vrednosti

Izvor: https://www.omnius.so, viewport 1440×900 (headless — bez scrollbara).

## Body / stranica

- `background: rgb(254, 254, 254)`
- `color: rgb(15, 20, 31)` — glavni tekst
- `font-family: Inter, Arial, sans-serif`
- `font-size: 16px` / `line-height: 20px` / `font-weight: 400`

## Glavni kontejner (`.container.w-container`)

Isti kontejner koristi se svuda i pravi vertikalne grid linije.

- `width: 1114px`
- `max-width: 1114px`
- `margin: 0 143px 0 143px` (na 1440 viewport → efektivno auto-centrirano;
  1440 − 1114 − 2 = 324, po 162 sa svake strane; margin 143 + border 1 +
  ~18 kod scrollbar-a → varira po viewport-u)
- `border-left: 1px dashed rgb(208, 213, 221)`
- `border-right: 1px dashed rgb(208, 213, 221)`

Varijante iste klase (nadograđene modifikatorima) drže istu širinu 1114 i
iste dashed bordure, a menjaju `padding`/`position`/`margin` po potrebi.
Vidi `styles.json` → `containerVariants` za punu listu.

## Grid linije preko stranice

**Ne postoji poseban overlay element** koji crta grid linije. Sve što deluje
kao "vertikalne grid linije preko cele stranice" dolazi iz `.container.w-container`
elemenata koji imaju `1px dashed rgb(208, 213, 221)` na levom i desnom border-u.
Kada su sekcije naslagane vertikalno, te leve i desne dashed bordure daju dve
neprekidne vertikalne linije oko sadržaja stranice.

Horizontalne dashed linije koje se ponekad vide su odvojeni `.divider` /
`hr` elementi po sekcijama (nisu deo globala — biće izvučeni po sekciji).

## `.below-nav-container`

Ista klasa kao `.container.w-container` sa modifikatorom `below-nav-container`:

- `padding: 50px 0 50px 0` — daje 50 px razmaka iznad prvog naslova i 50 px
  ispod headera.
- box: `y=70, h=100` (ispod nav-a koji je h=70)

## Fontovi (document.fonts, status: loaded)

| Family | Weight | Style |
|---|---|---|
| **Inter** | 100–900 (variable) | normal |
| **Alliance** | 300 | normal |
| **Alliance** | 600 | normal |
| **Geistmono** | 400 | normal |
| **Geistmono** | 500 | normal |
| **Geistmono** | 600 | normal |
| **Geistmono** | 700 | normal |

- **Inter** — telo teksta i UI (varijabilni font, cela raspona težina).
- **Alliance** — verovatno naslovi (samo 300 i 600).
- **Geistmono** — monospace, verovatno oznake/labele (4 težine).

Body koristi `Inter, Arial, sans-serif` — Alliance i Geistmono su primenjeni
selektivno preko dodatnih klasa (biće mapirani po sekciji).

## Responsive

Snimljeno sa omnius.so na 991×900, 767×900, 479×900, 1920×900
(Webflow breakpointi: 991 tablet, 767 mobilni položeno, 479 mobilni uspravno).
Fajlovi: `styles-991.json`, `styles-767.json`, `styles-479.json`, `styles-1920.json`.

### Container (`.container.w-container`)

| Viewport | Container box | `max-width` | Vertikalni padding | Dashed L/D |
|---:|---:|---:|---:|:---:|
| **1920** | 1114 px | 1114 px | 50 / 50 | ostaje |
| **1440** | 1114 px | 1114 px | 50 / 50 | ostaje |
| **991**  | 951 px  | none     | 50 / 50 | ostaje |
| **767**  | 727 px  | none     | 30 / 30 | ostaje |
| **479**  | 439 px  | none     | 30 / 30 | ostaje |

- Container je **kapiran na 1114 px na >= 991**; ispod 991 postaje **fluid**
  (raste sa viewport-om minus ~40 px bočnih margina koje daju roditeljski elementi).
- Iznad 1440 (npr. 1920) **ništa se ne menja** — container ostaje 1114 px.
- Vertikalni padding u varijantama sa `.below-nav-container` pada sa **50 → 30**
  na 767 i 479.
- **Dashed leva/desna linija (1px dashed rgb(208, 213, 221)) ostaje vidljiva na svim širinama.**

### Body

- `font-size: 16px` **na svim širinama** (ne skalira se).
