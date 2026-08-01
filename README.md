# Paris Trip

A React + Vite single-page itinerary, deployed to GitHub Pages.

**Live site:** https://lizbrown91-byte.github.io/Paris-trip/

## Local development

```bash
npm install
npm run dev      # http://localhost:5173/Paris-trip/
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` to GitHub Pages. Pages is configured with
**Settings → Pages → Source: GitHub Actions**.

Because the site is served from a subpath (`/Paris-trip/`), `vite.config.js`
sets `base: '/Paris-trip/'`. If the repository is ever renamed, that value has
to change to match.

## Content

The itinerary lives in the `itinerary` array at the top of `src/App.jsx`. It is
placeholder content — replace it (and the component around it) with the real
thing; nothing else in the project depends on what's in that file.
