# branko-everythink

Personal consulting site. Astro + TypeScript + Tailwind CSS v4, deployed to Cloudflare Pages.

## Struktura

- `src/pages/index.astro` — homepage, komponuje sekcije iz `src/components/sections/`
- `src/pages/work/tapihq.astro` — case study
- `src/layouts/BaseLayout.astro` — deljeni HTML shell
- `src/styles/global.css` — Tailwind entry + dizajn tokeni preko `@theme`

## Komande

```sh
npm install       # instaliraj zavisnosti
npm run dev       # dev server na http://localhost:4321
npm run build     # produkcioni build u dist/
npm run preview   # servira dist/ lokalno
npm run check     # astro check (TS + template)
npm run format    # prettier na svim fajlovima
```

## Deploy (Cloudflare Pages)

1. Napravi git repo i push-uj na GitHub:
   ```sh
   git init
   git add .
   git commit -m "initial scaffold"
   git branch -M main
   git remote add origin git@github.com:<user>/<repo>.git
   git push -u origin main
   ```
2. U Cloudflare dashboard-u: **Workers & Pages → Create → Pages → Connect to Git**.
3. Odaberi repo. Framework preset: **Astro**. Build command: `npm run build`. Output directory: `dist`. Node version: 24.
4. Deploy. Cloudflare će automatski redeploy-ovati na svaki push na `main`, sa preview deploy-ovima za PR-ove.
5. Pre production deploy-a: zameni `site` URL u `astro.config.mjs` sa pravim domenom.

## Sledeći koraci

- Popuni sekcije u `src/components/sections/` (trenutno prazni stub-ovi).
- Izaberi font i dodaj preko `@fontsource-variable/<font>` paketa.
- Dodaj scroll animacije po potrebi (biblioteka po izboru — nije uključena unapred).
