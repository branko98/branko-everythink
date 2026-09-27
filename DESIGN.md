# DESIGN.md — logika sistema

Ovaj dokument opisuje **kako sistem misli**, ne pojedinačne vrednosti.
Tačne px vrednosti su u `src/styles/tokens.css` i `reference/*/styles.json`;
ovde je logika koja objašnjava zašto je nešto tako.

Pre izrade nove sekcije: pročitaj i uklopi je u ovaj sistem. Ako neka ideja izlazi
iz sistema, to je verovatno pogrešna ideja — prvo pitaj.

---

## 1. Struktura stranice

**Sve što deluje kao "grid preko cele stranice" dolazi od jednog izvora: `.container`.**
Nema overlay elementa, nema pozadinske šeme sa linijama.

- `.container` je centrirani blok fiksne širine (1114 px na desktopu) sa
  **dashed leva/desna bordurom 1 px**. Boja: `--color-line`.
- Kada sekcije naslažete jednu na drugu, njihove `.container` bordure poravnate
  su vertikalno i **daju iluziju dve neprekidne "šine"** koje idu kroz celu
  stranicu. To su glavne vertikalne linije koje se vide u dizajnu.
- **Ne postoji sekcija koja izlazi iz container-a bočno.** Sve što je full-width
  (npr. tamna CTA pozadina) i dalje ima sadržaj centriran unutar 1114.

### Horizontalne linije između sekcija

Nisu deo globala. Svaka sekcija sama odlučuje da li dodaje `border-top` / `border-bottom`
u istoj dashed boji, u zavisnosti od dizajna. Dva pravila:

- Ako dve susedne sekcije obe zahtevaju liniju na dodiru, koristi se **samo jedna**
  (npr. bottom prethodne + top sledeće = jedna linija; jedna od dve mora biti izostavljena).
- Tamne sekcije (`08-cta-dark`) uvlače se sa `margin: -2px 0` kako bi svoje
  gornje/donje dashed linije **legle tačno preko** dashed linija susednih sekcija.

### Kako se sekcije slažu

Redosled i tipične visine su u `reference/sections.md`. Standardan patern:

```
Header (fixed, 70)
  ↓
below-nav spacer (100)   ← daje "vazduh" ispod header-a
  ↓
Sekcija 1 (bordered ili ne)
  ↓
Sekcija 2
  ...
```

Prva sekcija posle header-a **uvek** dobija spacer klase `.below-nav-container`
(prazan `.container` sa vertikalnim padding-om). Bez njega naslov leti pod header.

---

## 2. Sistem kolona

Container **1114 px** dele se u **12 baznih jedinica od ~92.83 px**. Nikada ne
crtaš 12 dashed linija — one su konceptualne. Praktično koristiš 4-col, 3-col ili
2-col podelu (grupe od 3, 4 ili 6 baznih jedinica), plus asimetrične kombinacije
istih:

| Grid | Kolona | Kada | Primer |
|---|---|---|---|
| **4 simetrične** | 4 × 278 px | jednake statistike / kompaktni redovi | `03-stats` |
| **3 simetrične** | 3 × 370.66 px | stepenasti kartični grid, dugi kartični redovi | `06-question-cards`, originalni `01-hero-subtitle` |
| **2 simetrične** | 2 × 557 px | tekst + prazan blok, dva stuba | naš `01-hero-subtitle` |
| **3-col asimetrična (2:1)** | 742 + 370 px | veliki naslov levo, prateći tekst/CTA desno | `05-section-heading` |
| **4-col asimetrična (3:1)** | 834 + 278 px | naslov levo, prazan aside desno | `01-hero-heading` |
| **1 kolona** | 1114 px | full-width kartica ili sekcija sa jednim blokom | `02-case-study`, `08-cta-dark` |

Svaka podela **crta interne vertikalne dashed linije** kao `border-left` na
grid ćelijama posle prve. To čini da tvoja sekcija "nastavlja" globalne šine
umesto da ih preseca. Prazne aside ćelije samo drže te linije — nemaju sadržaja.

**Pravilo:** ako je vertikalna dashed linija u sekciji, ona se **poklapa sa
jednom od podela iznad** (4 / 3 / 2, uključujući asimetrične 2:1 i 3:1). Ne
stavljaj liniju na proizvoljnu poziciju.

---

## 3. Tipografska logika

Tri porodice, svaka ima jasnu ulogu.

### Alliance No.2 (`--font-heading`)
- Za **glavne displej naslove**: h1 hero-a, veliki naslovi sekcija (05),
  brand tekst (kad nije logo). Weights 300 (light) i 600 (semibold);
  koristimo prevashodno 600.
- Ne koristi se za body, kartice, ni UI elemente.

### Inter Variable (`--font-body`)
- Za **sve što nije display naslov ni oznaka**: paragrafi, subtitle-i,
  imena klijenata, dugmad, link tekstovi. Weight raspon 100–900 (variable);
  praktično 400 za body, 500 za dugmad, 600 za podebljanja unutar body-a.

### Geist Mono (`--font-mono`)
- Za **oznake, kod-like elemente, definition redove i testimonial citate**:
  kategorije chip-ove (`Fintech`, `AI / LLM SaaS`), INDUSTRY / HEADQUARTERS
  metapodatke, duge citate u testimonial sekcijama, i bilo šta što ima
  "labelovan / uniform" karakter. Weights 400/500/600/700.

### Dvobojni naslovi ("highlight tail")

Veliki naslovi često imaju **prvi deo u svetlijoj sivoj boji**
(`--color-heading-muted`) **i poslednji deo u punoj tamnoj** (`--color-dark`).
Tamni deo je često kraća, udarna fraza. Implementira se sa dva `<span>`-a
unutar jednog `<h1>`. Ne razdvajaj u dva odvojena elementa — mora da deli
isti prored i mora da se "provuče" kroz prelome linija.

### Highlight na citatima (`background-color` marker)

Za istaknute frazi unutar dugih citata (testimonial): `<span>` sa **svetlo
plavom pozadinom**, bez padding-a, priljubljeno uz tekst; više instanci
unutar jednog citata. Konkretna vrednost boje: vidi
`reference/04-testimonial-featured/styles.json` → `.testimonial-text-bold`.
Ako ovaj obrazac krene da se koristi u više sekcija, treba je promovisati u
`--color-highlight` token (trenutno ne postoji).

Highlight je **uvek pozadinska podloga**, nikad boja teksta.

*(Napomena: u case-study sekciji `+227.9%` u result naslovu radi se preko
`--color-chip-bg` — ali to je već token za pill chip, ne za "heading highlight";
koristi se jer se ista boja vizuelno slaže sa chip-om iznad. Ne generalizuj to
za sve naslove.)*

---

## 4. Ponavljajuće komponente

### Dashed kartice
- Kartica se pravi kombinacijom `border-<side>` modifikator klasa:
  `.top-border`, `.right-border`, `.bottom-border`, `.left-border`. Svaka daje
  **1 px dashed liniju u istoj `--color-line` boji**.
- Kartica **nikada** nema solid border u sistemu dashed sekcija (izuzetak:
  case-study kartica koja je namerno "izdvojena" solid ivicom radi vizuelne
  razlike). Ako treba solid, to je poseban jezik.

### Corner markers (kvadratići na uglovima)
- `.square-small-edge` — **12×12 px**, čist crn (`--color-dark`), `position: absolute`
  na uglovima dashed kartica, preklapa dashed liniju.
- Vizuelno "spaja" dve dashed linije u tačku umesto da im ostavlja X presek.
- Koristi ih **samo tamo gde se kartice spajaju u stepenastom gridu**
  (`06-question-cards`). Ne trpaj ih svuda — imaju smisao samo na dodiru.

### Pill dugmad (CTA)
- Zaobljene sa **`border-radius: 50px`** (potpuno pill).
- 1 px solid border u `--color-line` (svetla ivica na svetloj pozadini).
- Sadržaj: label + strelica (SVG chevron ili line+arrow).
- Font: Inter 500 (`--text-cta-*` tokeni). Padding `--cta-padding-y` / `--cta-padding-x`.
- CTA "Get started" u header-u je referenca. Sekundarni "Case study" u
  karticama ima **isti tip strelice ali plav tekst** (`--color-link-blue`) i
  bez pilla — ravan link, gap 8 px između teksta i strelice.

### Definition red
- Ispod dužeg citata: horizontalna traka sa 4 stavke —
  **INDUSTRY / DEFINITION / HEADQUARTERS / URL** (labela + vrednost, sve u
  Geist Mono). Odvojen `border-top: 1px dashed`. Svaka stavka zauzima
  ~1/4 širine.
- Koristi se u featured testimonial-u (04). U list varijanti (09) je
  **isključena** — ako reciklas wrapper, filtriraj ovaj child.

### Testimonial highlight span
- `.testimonial-text-bold` — Geist Mono 700, svetlo plava pozadina, bez padding-a.
  Više instanci unutar jednog citata; vizuelno pravi "isečke" koji "svetle" po
  citatu (i verovatno se animiraju scroll-om — kasnije). Konkretna boja: vidi
  `reference/04-testimonial-featured/styles.json` → `.testimonial-text-bold`.
  Trenutno nema token — kad se koristi na više mesta, promoviši u
  `--color-highlight`.

### Blue link sa chevron-om
- Ravan tekst u `--color-link-blue`, font Inter 500, gap 8 px do strelice.
- Strelica je SVG (M/L/l notacija sa 1.4 stroke) ili čist CSS chevron
  (dva 2 px bordera na 6×6 divu).
- Koristi se u case-study i testimonial linkovima ("Case study →").

---

## 5. Responsive logika

**Webflow breakpointi (zadržavamo):** 991 tablet, 767 mobilni položeno,
479 mobilni uspravno. Nema stila izmedju 1440 i 1920 — dizajn je kapiran.

### Header — poseban slučaj (moj dizajn)

Header sadrži **samo logo (`public/logo.png`) i pill dugme "Get started"** —
nema nav linkova, nema hamburger menija ni na jednoj širini. Ovo je odstupanje
od originala (Omnius ima 4 dropdown linka + hamburger ispod 991).

- Visina **70 px** i CTA su **iste na svim širinama**.
- Na užim viewport-ovima logo se **smanjuje** (uz očuvanje odnosa stranica), tako
  da logo + CTA staju u jedan red **sve do 375 px**. Ne prelama se, ne skriva se.

### Iznad 1440 (uključujući 1920)
- Container ostaje **1114 px, centriran**. Sadržaj se ne rasteže.
- **Ništa se ne menja** — cela stranica izgleda isto na 1440 i 4K monitorima.

### ≥ 992 (desktop)
- Container 1114 px, dashed L/D bordure.
- Sve višekolonske podele su aktivne.
- Vertikalni padding u `.below-nav-container` je pun (50 gore/dole).

### 991–768 (tablet)
- **Container postaje fluid** — `max-width: none`, širina prati viewport
  (~951 na 991, ~727 na 767) minus male bočne margine. Dashed bordure ostaju.
- **Višekolonske podele počinju da se slažu**: hero subtitle (naš 2-col) → 1-col
  na 991. Hero heading ostaje 2-col ali kolona i tekst se sužavaju.
  Stats i question cards mogu ostati u redu 2 ili 4 zavisno od dizajna sekcije.
- Font glavnog naslova pada minimalno (35.7 → 33 kod hero h1).
- Na 767: **vertikalni padding container-a pada 50 → 30** (uštedeni prostor).

### 767–480 (mobilni landscape)
- Container i dalje fluid; padding ostaje 30/30.
- Podele koje su se držale 2-col često i dalje 2-col ali sa jako uzanim ćelijama.
- Case-study kartica **još uvek row** (tekst pored grafika), ali grafik znatno
  suženiji.

### ≤ 479 (mobilni portrait) — pravi lom
Sve što je 2+ kolone se **preslaguje u 1 kolonu**:
- Hero heading grid → **1 kolona** (aside se sklapa).
- Hero subtitle → 1 kolona (već je od 991).
- Case-study kartica: `flex-direction: column` — **tekst iznad grafikona**,
  padding kartice pada **40 → 25**, kartica postaje ~50% viša.
- Fontovi displej naslova padaju izraženo: hero h1 **26 / 39 / -1**
  (bilo 35.7 / 48 / -1.2). Subtitle 16 / 26 → **15 / 24.375**.
- `below-nav` padding-top ostaje 30 (već je pao na 767).

### Šta ostaje nepromenjeno na svim širinama
- Body font-size: **16 px**.
- Header visina: **70 px** i CTA vidljiv (logo se samo smanjuje).
- Dashed leva/desna bordura container-a: **1 px `--color-line`**.
- Border-radius, boje, priroda font familja.

### Pravila za novu sekciju
1. **Layout na 1440 se izvodi iz podele 12-col** (praktično 4×278 ili 3×370 ili 2×557).
2. **Responsive ponašanje se prvo proverava na originalu** — pokreni
   `node reference/_tools/capture.mjs --width=991`, zatim 767 i 479 i pogledaj
   `styles-*.json` te sekcije. Opšta pravila iz ovog dokumenta koriste se
   **samo kad original ne postoji** (npr. `07-good-bad-table`).
3. **Definiši ponašanje za 991, 767, 479** unapred — ne dodavaj responsive naknadno.
4. **Iznad 991** ne dodaj media query — kapirano.
5. Ako sekcija ima kartice u redu (2+), **prvo pitanje**: kako se slažu na 479?
   Skoro uvek: u kolonu, jedna ispod druge, sa istim dashed linijama pretvorenim
   u horizontalne.
6. Font-size media query pišeš **samo za displej naslove** (Alliance) i to
   samo na 479 (i eventualno 991 ako je smanjenje malo, kao −2.7 px na hero h1).
   Body/mono se **ne skaliraju** osim izuzetka na 479 (subtitle 16 → 15).

---

## 6. Gde se moj sajt razlikuje od originala

Original (Omnius) je izvor **stila, vrednosti i responsive ponašanja**. Nije
uzor za **strukturu ili sadržaj** moje stranice. Neka namerna odstupanja:

- **Header** — moj ima **samo logo + CTA "Get started"**, bez nav linkova i
  bez hamburgera. Original ima 4 dropdown linka + hamburger ispod 991.
- **Hero podnaslov** — moj je **2-col grid** (tekst + prazan blok sa dashed
  border-left). Original je 3-col.
- **Question cards (06)** — moj ima **4 kartice** u vlastitom rasporedu.
  Original ima 3.
- **Good/bad tabela (07)** — **nova sekcija bez originala**. Gradi se isključivo
  iz tokena i pravila iz ovog dokumenta.
- **Grafikon u case-study (02)** — **SVG generisan iz niza podataka slajda**
  (linija + vertikalne linije + završna tačka). Original ima raster PNG
  (`image-8.graph-line`) sa reveal overlay-om.
- **Akcent linija kod testimoniala** — **CSS `border-left` ili pseudo-element**.
  Original je 2×26 raster (`img.testimonial-line`).
- **Sav tekst, logotipi i imena klijenata** — moji su. Trenutno **placeholder**
  (Fintech / AI+LLM SaaS / Myos / Speedinvest itd.); zameniti pri produkciji.

### Pravilo
**Kad se original i moj dizajn ne poklapaju, pobeđuje moj dizajn.** Ne vraćaj
elemente sa originala koji nisu u mom dizajnu (npr. nav linkove, treću kolonu
podnaslova, treću karticu). Original služi da tačno pogodiš stil onoga što
JESTE u mom dizajnu — ne da doda ono što NIJE.
