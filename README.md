# Paris Trip

A React + Vite travel guide for the Bobulski family's October 2026 Paris trip,
deployed to GitHub Pages. Four sections — Home (with a countdown), Travel
Details, Trip Itinerary, and Other Ideas (a filterable map of recommendations).

**Live site:** https://lizbrown91-byte.github.io/Paris-trip/

## Local development

```bash
npm install
npm run dev      # http://localhost:5173/Paris-trip/
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Deployment

Pushes trigger `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages.

This requires a one-time setup step: **Settings → Pages → Source: GitHub
Actions**. The workflow's own token is not permitted to enable Pages, so it has
to be switched on by hand before the first deploy can succeed.

Because the site is served from a subpath (`/Paris-trip/`), `vite.config.js`
sets `base: '/Paris-trip/'`. If the repository is ever renamed, that value has
to change to match.

## Content

Everything the site displays lives in the data objects at the top of
`src/ParisTravelGuide.jsx` — `TRIP`, `FLIGHTS`, `AIRBNB`, `QUICK_LINKS`,
`ITINERARY`, and `RECOMMENDATIONS`. Editing those updates the whole site; no
other file needs to change.

This site is published publicly, so it deliberately carries no door code, Wi-Fi
password, host phone number, or booking confirmation numbers. Keep those
somewhere private — a shared note or a password manager — rather than adding
them here.
