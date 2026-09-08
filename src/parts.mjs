import { ICON } from "./layout.mjs";

/* ---------- smooth path helper (Catmull-Rom -> cubic bezier) ---------- */
function smooth(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/* ---------- Dyno chart: real HP / torque curves ---------- */
export function dynoChart() {
  const W = 820, H = 360, L = 52, R = 22, T = 18, B = 40;
  const rpm = [2000, 3000, 4000, 5000, 6000, 6500, 7000, 7500, 8000];
  const hp  = [ 62,  134,  218,  301,  374,  404,  396,  358,  306];
  const tq  = [161,  231,  286,  317,  328,  327,  297,  251,  201];
  const maxY = 440, minX = 2000, maxX = 8000;
  const px = r => L + ((r - minX) / (maxX - minX)) * (W - L - R);
  const py = v => H - B - (v / maxY) * (H - T - B);

  const hpPts = rpm.map((r, i) => [px(r), py(hp[i])]);
  const tqPts = rpm.map((r, i) => [px(r), py(tq[i])]);
  const hpPath = smooth(hpPts);
  const areaPath = `${hpPath} L ${px(maxX).toFixed(1)} ${(H - B).toFixed(1)} L ${px(minX).toFixed(1)} ${(H - B).toFixed(1)} Z`;

  const yTicks = [0, 110, 220, 330, 440];
  return `
<div class="dyno-chart rv">
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Dyno chart: peak 404 horsepower at 6500 rpm and 328 lb-ft of torque at 6000 rpm">
    <defs>
      <linearGradient id="hpFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff2b30" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#ff2b30" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${yTicks.map(v => `<line class="dyno-gridline" x1="${L}" y1="${py(v).toFixed(1)}" x2="${W - R}" y2="${py(v).toFixed(1)}"/>
    <text class="dyno-tick" x="${L - 10}" y="${(py(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`).join("\n    ")}
    ${rpm.filter((_, i) => i % 2 === 0).map(r => `<text class="dyno-tick" x="${px(r).toFixed(1)}" y="${H - B + 20}" text-anchor="middle">${r / 1000}k</text>`).join("\n    ")}
    <line class="dyno-axis" x1="${L}" y1="${T}" x2="${L}" y2="${H - B}"/>
    <line class="dyno-axis" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"/>
    <path class="dyno-area" d="${areaPath}"/>
    <path class="dyno-curve dyno-curve--tq" d="${smooth(tqPts)}" data-draw/>
    <path class="dyno-curve dyno-curve--hp" d="${hpPath}" data-draw/>
    <circle cx="${px(6500).toFixed(1)}" cy="${py(404).toFixed(1)}" r="4.5" fill="#ff2b30"/>
    <text class="dyno-tick" x="${(px(6500) + 10).toFixed(1)}" y="${(py(404) - 10).toFixed(1)}" fill="#f4f6f8">404 HP @ 6,500</text>
  </svg>
  <div class="dyno-legend">
    <span class="dyno-key"><i></i> Horsepower (whp)</span>
    <span class="dyno-key dyno-key--tq"><i></i> Torque (lb-ft)</span>
    <span class="dyno-key dyno-key--note">Sample run · 2.0T · after custom map</span>
  </div>
  <div class="dyno-readout">
    <div><span class="label">Peak power</span><b data-count="404">0</b></div>
    <div><span class="label">Peak torque</span><b data-count="328">0</b></div>
    <div><span class="label">Gain vs stock</span><b>+38<span class="accent">%</span></b></div>
  </div>
</div>`;
}

/* ---------- Blueprint technical art (photo-ready stand-ins) ---------- */
const ART = {
  turbo: `<g fill="none" stroke="currentColor" stroke-width="1.1">
    <circle cx="300" cy="200" r="132"/><circle cx="300" cy="200" r="104"/><circle cx="300" cy="200" r="44"/><circle cx="300" cy="200" r="15"/>
    ${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const x1 = 300 + Math.cos(a) * 46, y1 = 200 + Math.sin(a) * 46; const x2 = 300 + Math.cos(a + 0.5) * 102, y2 = 200 + Math.sin(a + 0.5) * 102; return `<path d="M${x1.toFixed(0)} ${y1.toFixed(0)} Q ${(300 + Math.cos(a + 0.1) * 78).toFixed(0)} ${(200 + Math.sin(a + 0.1) * 78).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}"/>`; }).join("")}
    <path d="M432 200h120M48 200h120" stroke-dasharray="4 6"/>
  </g>`,
  engine: `<g fill="none" stroke="currentColor" stroke-width="1.1">
    ${[0, 1, 2, 3].map(i => `<rect x="${120 + i * 84}" y="96" width="60" height="118" rx="2"/><circle cx="${150 + i * 84}" cy="240" r="20"/><path d="M${150 + i * 84} 214v6M${150 + i * 84} 260v34"/>`).join("")}
    <path d="M96 300h360M96 60h360" stroke-dasharray="4 6"/><circle cx="300" cy="330" r="52"/><circle cx="300" cy="330" r="14"/>
  </g>`,
  wheel: `<g fill="none" stroke="currentColor" stroke-width="1.1">
    <circle cx="300" cy="200" r="150"/><circle cx="300" cy="200" r="128"/><circle cx="300" cy="200" r="40"/><circle cx="300" cy="200" r="12"/>
    ${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<path d="M${(300 + Math.cos(a) * 42).toFixed(0)} ${(200 + Math.sin(a) * 42).toFixed(0)} L ${(300 + Math.cos(a + 0.18) * 126).toFixed(0)} ${(200 + Math.sin(a + 0.18) * 126).toFixed(0)}"/>`; }).join("")}
    ${Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 + 0.3; return `<circle cx="${(300 + Math.cos(a) * 26).toFixed(0)}" cy="${(200 + Math.sin(a) * 26).toFixed(0)}" r="4"/>`; }).join("")}
  </g>`,
  exhaust: `<g fill="none" stroke="currentColor" stroke-width="1.1">
    <path d="M40 150c90 0 90 60 180 60s90-60 180-60 90 60 160 60"/>
    <path d="M40 190c90 0 90 60 180 60s90-60 180-60 90 60 160 60"/>
    <path d="M40 230c90 0 90 60 180 60s90-60 180-60 90 60 160 60" stroke-dasharray="3 7"/>
    <circle cx="520" cy="210" r="46"/><circle cx="520" cy="210" r="30"/>
    <path d="M120 100v220M300 100v220" stroke-dasharray="4 6"/>
  </g>`,
  spring: `<g fill="none" stroke="currentColor" stroke-width="1.1">
    ${Array.from({ length: 11 }, (_, i) => `<ellipse cx="300" cy="${80 + i * 24}" rx="${74 - Math.abs(5 - i) * 3}" ry="12"/>`).join("")}
    <path d="M300 40v42M300 348v34"/><rect x="248" y="20" width="104" height="22" rx="2"/><rect x="248" y="360" width="104" height="22" rx="2"/>
  </g>`,
  ecu: `<g fill="none" stroke="currentColor" stroke-width="1.1">
    <rect x="150" y="110" width="300" height="180" rx="3"/><rect x="196" y="152" width="208" height="96" rx="2"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${168 + i * 22} 110V74M${168 + i * 22} 290v36"/>`).join("")}
    <path d="M228 186h44M228 208h84M228 230h60" stroke-dasharray="3 5"/><circle cx="380" cy="200" r="16"/>
  </g>`,
};

export function buildArt(kind) {
  return `<div class="build-art" aria-hidden="true"><svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">${ART[kind] || ART.turbo}</svg></div>`;
}

/* ---------- Brand wall ---------- */
export const BRANDS = [
  ["Injector Dynamics","injector-dynamics"],["Mishimoto","mishimoto"],["Link ECU","link-ecu"],
  ["DiabloSport","diablosport"],["Work Wheels","work-wheels"],["ACL","acl"],["ARP","arp"],
  ["Red Horse","red-horse"],["Viezu","viezu"],["TiAL","tial"],["HKS","hks"],["Sparco","sparco"],
  ["KW","kw"],["Manley","manley"],["JE Pistons","je-pistons"],["Garrett","garrett"],
  ["Sytec Motorsport","sytec"],["Brian Crower","brian-crower"],["RaceChip","racechip"],["NGK","ngk"],
  ["Ferrea","ferrea"],["D2 Racing","d2-racing"],["Samco Sport","samco"],["AutoMeter","autometer"],
  ["Dbilas","dbilas"],["Earl's","earls"],["Milltek Sport","milltek"],["HP Tuners","hp-tuners"],
  ["Megan Racing","megan-racing"],["CarTech","cartech"],["Cusco","cusco"],["Zestino Tyres","zestino"],
  ["Tilton","tilton"],["Clutch Masters","clutch-masters"],
];

// NOT lazy: the track scrolls horizontally, so off-screen logos would never load and
// leave gaps. Only 34 unique files are requested — the duplicates come from cache.
const mark = b => `<span class="brand-mark"><img src="assets/brands/${b[1]}.webp" alt="${b[0]}" title="${b[0]}" decoding="async" width="120" height="44" /></span>`;

export function brandMarquee() {
  const a = [...BRANDS, ...BRANDS].map(mark).join("");
  const b = [...BRANDS].reverse();
  const c = [...b, ...b].map(mark).join("");
  return `<div class="marquee"><div class="marquee-track">${a}</div></div>
  <div class="marquee marquee--rev"><div class="marquee-track">${c}</div></div>`;
}

export function brandGrid() {
  return `<div class="brand-grid">${BRANDS.map(b => `<div class="brand-cell"><img src="assets/brands/${b[1]}.webp" alt="${b[0]}" title="${b[0]}" loading="lazy" width="120" height="46" /></div>`).join("")}</div>`;
}

/* ---------- Chapter head ---------- */
export function chapter({ n, title, lede = "", aside = "" }) {
  return `<div class="chapter rv">
    <div class="chapter-top"><span class="chapter-num">${n}</span><span class="label">${title.toUpperCase()}</span></div>
    ${lede || aside ? `<div class="chapter-body"><div>${lede}</div><div>${aside}</div></div>` : ""}
  </div>`;
}

/* ---------- FAQ ---------- */
export function faq(items) {
  return `<div class="acc">${items.map((it, i) => `
    <div class="acc-item">
      <button class="acc-q" type="button" aria-expanded="false" aria-controls="a${i}" id="q${i}">
        <span>${it.q}</span><span class="acc-ico" aria-hidden="true"></span>
      </button>
      <div class="acc-a" id="a${i}" role="region" aria-labelledby="q${i}"><p>${it.a}</p></div>
    </div>`).join("")}</div>`;
}

export { ICON };

/* ---------- Interior page hero ---------- */
export function pageHero({ eyebrow, title, lede, actions = "" }) {
  return `
<section class="hero hero--page">
  <div class="hero-bg" aria-hidden="true">
    <div class="hero-glow" id="heroGlow"></div>
    <div class="hero-grid"></div>
    <div class="hero-vig"></div>
  </div>
  <div class="wrap hero-in">
    <p class="label label--red rv">${eyebrow}</p>
    <h1 class="display page-title rv rv-1">${title}</h1>
    ${lede ? `<p class="lede hero-lede rv rv-2">${lede}</p>` : ""}
    ${actions ? `<div class="hero-actions rv rv-3">${actions}</div>` : ""}
  </div>
</section>`;
}
