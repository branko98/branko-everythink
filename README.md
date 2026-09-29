# Everythink – website (Astro)

## Pokretanje
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statički sajt u dist/
npm run preview
```

## Gde se menja šta
- **Sav tekst:** `src/data/home.ts` – dizajn ne treba dirati.
  - `[[tekst]]` = istaknuto (plava pozadina; u "Bad example" koloni crvena)
  - `**tekst**` = bold
- **Boje, fontovi, širina kolone:** `src/styles/global.css` (`:root` promenljive)
- **Animacije:** `src/styles/motion.css` + `src/scripts/animations.ts`
- **Sekcije:** `src/components/*.astro`, redosled u `src/pages/index.astro`
- **Logo / wordmark:** `public/logo.png`, `public/wordmark.png` (zameniti SVG verzijom kad bude spremna)

## Animacije
- Naslovi se iskucavaju kad uđu u ekran (`data-type="1500"` = trajanje u ms)
- Fade-up blokova (`data-reveal`, kašnjenje preko `--d`)
- Brojači u statistikama, iscrtavanje grafikona, iscrtavanje "stepenica" sa pitanjima
- Pomeranje highlight-a u citatima, kursor pored avatara
- Sve je isključeno ako posetilac ima uključeno "reduce motion", i sajt radi bez JS-a.

## Fontovi
Inter (variable, optical size) + IBM Plex Mono, self-hosted preko Fontsource (bez Google Fonts poziva – bolje za GDPR).
Ako se potvrdi da Omnius koristi drugi font, menja se u `src/layouts/Base.astro` i `--font-sans` / `--font-mono`.
