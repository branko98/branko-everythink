# Pravila za rad sa slikama
- Nikad ne otvaraj (view/read) sliku čija je bilo koja strana veća od 1800px.
- Kad treba da pogledaš veliku sliku, prvo napravi umanjenu kopiju (max 1800px 
  po dužoj strani) u reference/_previews/ i gledaj samo nju.
- Originale nikad ne umanjuj niti prepisuj — oni ostaju u punoj rezoluciji.
- Screenshotove sa Playwright-a pravi po sekcijama, ne cele stranice.

# Pravila izrade
- **Pre izrade bilo koje sekcije pročitaj `DESIGN.md`. Nova sekcija mora da se 
  uklopi u taj sistem.**
- Stack: Astro + običan CSS. Svaka sekcija je zasebna komponenta u 
  `src/components/`.
- Sve vrednosti isključivo iz `src/styles/tokens.css`. Bez hardkodovanih boja, 
  fontova i razmaka u komponentama.
- Kad radiš na jednoj sekciji, ne menjaj `tokens.css`, `global.css`, `Layout` ni 
  druge komponente osim ako to eksplicitno tražim. Ako misliš da treba — pitaj.
- `design.png` određuje raspored i sadržaj; `original.png` i `styles.json` tačne 
  vrednosti (fontovi, razmaci, linije, boje). Kad se razlikuju, pobeđuje 
  `design.png`.
- Svaka sekcija se završava vizuelnim poređenjem 
  (`reference/_previews/compare-<slug>.png`, generisano sa 
  `node reference/_tools/compare.mjs <slug> --selector=…`) pre nego što kažeš da 
  je gotova.
