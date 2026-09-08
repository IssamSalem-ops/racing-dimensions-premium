import { readdir, mkdir, rm, cp, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, NAV } from "./src/layout.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");

const PAGES = [
  ["home.mjs",     "index.html"],
  ["dyno.mjs",     "dyno.html"],
  ["services.mjs", "services.html"],
  ["brands.mjs",   "brands.html"],
  ["builds.mjs",   "builds.html"],
  ["about.mjs",    "about.html"],
  ["contact.mjs",  "contact.html"],
];

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// 1. static assets -> dist
await cp(join(ROOT, "static"), DIST, { recursive: true });

// 2. render pages
let total = 0;
for (const [mod, out] of PAGES) {
  const { default: html } = await import(`./src/pages/${mod}?t=${Date.now()}`);
  await writeFile(join(DIST, out), html, "utf8");
  total += html.length;
  console.log(`  ${out.padEnd(16)} ${(html.length / 1024).toFixed(1)} KB`);
}

// 3. robots + sitemap
await writeFile(join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`, "utf8");

const today = new Date().toISOString().slice(0, 10);
await writeFile(join(DIST, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${NAV.map(n => `  <url>
    <loc>${SITE.domain}/${n.href === "index.html" ? "" : n.href}</loc>
    <lastmod>${today}</lastmod>
    <priority>${n.href === "index.html" ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>\n`, "utf8");

// 4. security headers for Netlify / Cloudflare Pages
await writeFile(join(DIST, "_headers"),
`/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: frame-ancestors 'self'; upgrade-insecure-requests

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`, "utf8");

// GitHub Pages runs Jekyll by default, which skips files/dirs starting with "_".
await writeFile(join(DIST, ".nojekyll"), "", "utf8");

const files = await readdir(DIST);
console.log(`\n✓ Built ${PAGES.length} pages (${(total / 1024).toFixed(0)} KB HTML) → dist/`);
console.log(`  root entries: ${files.join(", ")}`);
