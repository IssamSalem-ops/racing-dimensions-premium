/* Shared shell for every page. Keeps 7 pages perfectly consistent. */

export const SITE = {
  name: "Racing Dimensions",
  domain: "https://www.racing-dimensions.com",
  phoneDisplay: "+962 7 9554 3492",
  phoneRaw: "+962795543492",
  wa: "962795543492",
  email: "sales@racing-dimensions.com",
  address: "Al Sena'a Industrial Zone, Amman — Jordan",
  since: "2003",
};

export const NAV = [
  { n: "01", label: "Home",        href: "index.html"    },
  { n: "02", label: "Dyno Center", href: "dyno.html"     },
  { n: "03", label: "Services",    href: "services.html" },
  { n: "04", label: "Brands",      href: "brands.html"   },
  { n: "05", label: "Builds",      href: "builds.html"   },
  { n: "06", label: "About",       href: "about.html"    },
  { n: "07", label: "Contact",     href: "contact.html"  },
];

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c2.7 0 3 0 4.1.1 1 .1 1.7.2 2.3.5.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.3.6.4 1.3.5 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 1-.2 1.7-.5 2.3-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.6.3-1.3.4-2.3.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1-.1-1.7-.2-2.3-.5-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.3-.6-.4-1.3-.5-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c.1-1 .2-1.7.5-2.3.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .6-.3 1.3-.4 2.3-.5C9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12Zm-13 3V9l5.2 3-5.2 3Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>',
};
export { ICON };

function header(current) {
  return `
  <header class="hdr" id="hdr">
    <div class="wrap hdr-in">
      <a class="brand" href="index.html" aria-label="${SITE.name} — home">
        <img src="assets/img/logo.webp" alt="${SITE.name}" width="180" height="46" />
      </a>
      <nav class="nav" aria-label="Primary">
        ${NAV.map(i => `<a href="${i.href}"${i.href === current ? ' aria-current="page"' : ""}>${i.label}</a>`).join("\n        ")}
      </nav>
      <div class="hdr-cta">
        <a class="hdr-phone" href="tel:${SITE.phoneRaw}">${SITE.phoneDisplay}</a>
        <a class="btn" href="contact.html">Book a Dyno ${ICON.arrow}</a>
        <button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="menu" id="menu" aria-hidden="true">
    <div class="wrap">
      <ul class="menu-list">
        ${NAV.map(i => `<li><a href="${i.href}"><i>${i.n}</i>${i.label}</a></li>`).join("\n        ")}
      </ul>
      <div class="menu-foot">
        <a class="label" href="tel:${SITE.phoneRaw}">${SITE.phoneDisplay}</a>
        <a class="label" href="mailto:${SITE.email}">${SITE.email}</a>
        <span class="label">${SITE.address}</span>
      </div>
    </div>
  </div>`;
}

function footer() {
  const soc = [
    ["https://www.instagram.com/racing.dimensions/", "Instagram", ICON.instagram],
    ["https://www.youtube.com/@racing-dimensions", "YouTube", ICON.youtube],
    ["https://www.linkedin.com/company/racing-dimensions/", "LinkedIn", ICON.linkedin],
    ["https://www.facebook.com/RacingDimension/", "Facebook", ICON.facebook],
  ];
  return `
  <footer class="ftr">
    <div class="wrap">
      <div class="ftr-cta rv">
        <p class="label label--red">Start the conversation</p>
        <h2 class="mt-m">Bring us the car. We'll find the power.</h2>
        <div class="hero-actions">
          <a class="btn" href="contact.html">Book a dyno session ${ICON.arrow}</a>
          <a class="btn btn--ghost" href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">WhatsApp us</a>
        </div>
      </div>

      <div class="ftr-grid">
        <div class="ftr-col">
          <img class="ftr-logo" src="assets/img/logo.webp" alt="${SITE.name}" width="180" height="46" />
          <p class="measure-36">Performance parts, engine management and a professional in-house Dyno Center. Racing since ${SITE.since}.</p>
          <div class="socials">
            ${soc.map(([h, l, i]) => `<a href="${h}" target="_blank" rel="noopener" aria-label="${l}">${i}</a>`).join("")}
          </div>
        </div>
        <div class="ftr-col">
          <h4>Explore</h4>
          ${NAV.slice(1, 5).map(i => `<a href="${i.href}">${i.label}</a>`).join("")}
        </div>
        <div class="ftr-col">
          <h4>Company</h4>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="dyno.html">Book a session</a>
        </div>
        <div class="ftr-col">
          <h4>Visit</h4>
          <p>${SITE.address}</p>
          <a href="tel:${SITE.phoneRaw}">${SITE.phoneDisplay}</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <p>Sat–Thu 09:00–19:00 · Fri closed</p>
        </div>
      </div>

      <div class="ftr-bar">
        <span>© <span id="yr">2026</span> ${SITE.name}. All rights reserved.</span>
        <span>Tuning Parts &amp; Dyno Center · Amman, Jordan</span>
      </div>
    </div>
  </footer>`;
}

export function page({ title, desc, current, body, jsonld = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; frame-src https://www.google.com https://maps.google.com; connect-src 'self' https://api.web3forms.com; form-action 'self' https://api.web3forms.com" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="theme-color" content="#08090b" />
<link rel="canonical" href="${SITE.domain}/${current === "index.html" ? "" : current}" />
<link rel="icon" href="assets/img/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png" />
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:site_name" content="${SITE.name}" />
<link rel="preload" href="assets/fonts/oswald-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="styles.css?v=1" />
${jsonld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="prog" id="prog" aria-hidden="true"></div>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
<script src="app.js?v=1"></script>
</body>
</html>`;
}
