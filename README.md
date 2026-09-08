# Racing Dimensions — Premium Site (v2)

A 7-page, dark-cinematic marketing site for Racing Dimensions (Amman, Jordan).
Static output — deploys to any host, no server or database required.

## Build

```bash
node build.mjs      # renders src/ + static/ -> dist/
```

`dist/` is the deployable folder. Nothing else needs to ship.

## Structure

```
src/layout.mjs      shared shell: <head>, header, overlay menu, footer, JSON-LD
src/parts.mjs       reusable blocks: dyno chart, blueprint art, brand wall, FAQ
src/pages/*.mjs     one module per page (content only)
static/styles.css   the whole design system (tokens -> components)
static/app.js       interaction layer
static/assets/      fonts, 34 brand logos, logo, favicons
build.mjs           renders pages + robots.txt + sitemap.xml + _headers
```

To edit copy, open the relevant `src/pages/*.mjs` and re-run `node build.mjs`.

## Design decisions

- **Dark only.** A light mode dilutes the cinematic art direction.
- **No photography.** The site is deliberately typographic: oversized Oswald display
  type, cinematic lighting, real brand logos, a live dyno data visualisation and
  blueprint-style technical SVG art. It is *photo-ready* — drop real workshop
  photos into the `.build-art` slots when they exist.
- **Strict CSP.** `script-src 'self'`, `style-src 'self'`, `object-src 'none'`.
  There are **zero inline styles or scripts** — every style is a real class.
  If you add markup, do not use `style="..."`; it will be blocked.
- **Self-hosted fonts.** No third-party requests anywhere.

## Before the client goes live

1. **Web3Forms key** — replace `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY` in
   `src/pages/contact.mjs`. Until then the form falls back to opening the
   visitor's email client, so no lead is lost.
2. **Real photography** for the Builds page and build tiles.
3. **Verify claims** — the "authorised dealer" wording, the sample dyno figures
   (404 whp / 328 lb-ft), pricing, and opening hours.
4. **Testimonial** on the homepage is the company's own founding quote; add real
   customer reviews if desired.
5. **SSL** — automatic on Netlify / Cloudflare Pages; must be installed manually
   on traditional hosting.

## Deploy

Drag `dist/` onto <https://app.netlify.com/drop>, or:

```bash
cd dist && npx --yes netlify-cli deploy --dir . --prod
```

`_headers` (security headers + asset caching) is generated into `dist/` and is
read by both Netlify and Cloudflare Pages.
