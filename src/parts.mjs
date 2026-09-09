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

/* ---------- Interactive dyno chart ----------
   Four tune stages of real-shaped curves. Paths are pre-smoothed here and
   embedded as data so app.js can morph between stages and scrub a live
   readout without duplicating the maths. ------------------------------- */
const GEO = { W: 820, H: 360, L: 54, R: 24, T: 18, B: 40, minX: 2000, maxX: 8000, maxY: 520 };
const RPM = [2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000];

const STAGES = {
  stock:  { label: "Stock",
    hp: [ 45, 72,101,133,166,199,229,256,277,291,285,259,221],
    tq: [118,151,177,200,218,232,241,245,242,235,214,181,145] },
  s1: { label: "Stage 1",
    hp: [ 55, 88,124,163,203,243,280,312,335,340,331,302,258],
    tq: [144,185,217,245,267,284,294,298,293,275,248,211,169] },
  s2: { label: "Stage 2",
    hp: [ 62, 99,140,184,229,274,316,352,378,404,396,358,306],
    tq: [161,208,244,276,301,320,332,336,331,327,297,251,201] },
  s3: { label: "Stage 3",
    hp: [ 72,115,162,213,265,317,366,408,438,468,459,415,355],
    tq: [187,241,283,320,349,371,385,389,383,378,344,291,233] },
};

const px = r => GEO.L + ((r - GEO.minX) / (GEO.maxX - GEO.minX)) * (GEO.W - GEO.L - GEO.R);
const py = v => GEO.H - GEO.B - (v / GEO.maxY) * (GEO.H - GEO.T - GEO.B);

function buildStage(st) {
  const hpPts = RPM.map((r, i) => [px(r), py(st.hp[i])]);
  const tqPts = RPM.map((r, i) => [px(r), py(st.tq[i])]);
  const hpPath = smooth(hpPts);
  const peakHp = Math.max(...st.hp), peakTq = Math.max(...st.tq);
  return {
    label: st.label, hp: st.hp, tq: st.tq,
    hpPath, tqPath: smooth(tqPts),
    areaPath: `${hpPath} L ${px(GEO.maxX).toFixed(1)} ${(GEO.H - GEO.B).toFixed(1)} L ${px(GEO.minX).toFixed(1)} ${(GEO.H - GEO.B).toFixed(1)} Z`,
    peakHp, peakTq,
    peakRpm: RPM[st.hp.indexOf(peakHp)],
  };
}

export function dynoChart() {
  const built = Object.fromEntries(Object.entries(STAGES).map(([k, v]) => [k, buildStage(v)]));
  const stockPeak = built.stock.peakHp;
  Object.values(built).forEach(b => { b.gain = Math.round(((b.peakHp - stockPeak) / stockPeak) * 100); });
  const d = built.s2;
  const data = JSON.stringify({ geo: GEO, rpm: RPM, stages: built });
  const yTicks = [0, 130, 260, 390, 520];

  return `
<div class="dyno rv" data-dyno='${data}'>
  <div class="dyno-head">
    <div class="dyno-stages" role="group" aria-label="Tune stage">
      ${Object.entries(built).map(([k, b]) => `<button type="button" class="stage-btn${k === "s2" ? " is-on" : ""}" data-stage="${k}" aria-pressed="${k === "s2"}">${b.label}</button>`).join("")}
    </div>
    <p class="dyno-hint">Drag across the graph to read the run</p>
  </div>

  <div class="dyno-chart">
    <svg viewBox="0 0 ${GEO.W} ${GEO.H}" role="img" aria-label="Interactive dyno chart: horsepower and torque against engine speed, selectable by tune stage">
      <defs>
        <!-- Power heats along the run: amber -> crimson. Both in-palette. -->
        <linearGradient id="hpStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ff7a1a"/><stop offset="100%" stop-color="#ff2d55"/>
        </linearGradient>
        <linearGradient id="hpFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff7a1a" stop-opacity="0.34"/>
          <stop offset="60%" stop-color="#ff2d55" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#ff2d55" stop-opacity="0"/>
        </linearGradient>
      </defs>

      ${yTicks.map(v => `<line class="dyno-gridline" x1="${GEO.L}" y1="${py(v).toFixed(1)}" x2="${GEO.W - GEO.R}" y2="${py(v).toFixed(1)}"/><text class="dyno-tick" x="${GEO.L - 10}" y="${(py(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`).join("\n      ")}
      ${RPM.filter((_, i) => i % 2 === 0).map(r => `<text class="dyno-tick" x="${px(r).toFixed(1)}" y="${GEO.H - GEO.B + 20}" text-anchor="middle">${r / 1000}k</text>`).join("\n      ")}
      <line class="dyno-axis" x1="${GEO.L}" y1="${GEO.T}" x2="${GEO.L}" y2="${GEO.H - GEO.B}"/>
      <line class="dyno-axis" x1="${GEO.L}" y1="${GEO.H - GEO.B}" x2="${GEO.W - GEO.R}" y2="${GEO.H - GEO.B}"/>

      <path class="dyno-area"                    id="dynoArea" d="${d.areaPath}"/>
      <path class="dyno-curve dyno-curve--tq"    id="dynoTq"   d="${d.tqPath}" data-draw/>
      <path class="dyno-curve dyno-curve--hp"    id="dynoHp"   d="${d.hpPath}" data-draw/>

      <g class="dyno-cross" id="dynoCross" aria-hidden="true">
        <line class="dyno-cross-line" id="crossLine" x1="0" y1="${GEO.T}" x2="0" y2="${GEO.H - GEO.B}"/>
        <circle class="dyno-dot dyno-dot--hp" id="crossHp" r="5"/>
        <circle class="dyno-dot dyno-dot--tq" id="crossTq" r="5"/>
      </g>
      <rect class="dyno-hit" id="dynoHit" x="${GEO.L}" y="${GEO.T}" width="${GEO.W - GEO.L - GEO.R}" height="${GEO.H - GEO.T - GEO.B}"/>
    </svg>
  </div>

  <div class="dyno-legend">
    <span class="dyno-key"><i></i> Horsepower (whp)</span>
    <span class="dyno-key dyno-key--tq"><i></i> Torque (lb-ft)</span>
    <span class="dyno-key dyno-key--note" id="dynoLive">Sample run · 2.0T</span>
  </div>

  <div class="dyno-readout">
    <div class="acc-heat"><span class="label">Peak power</span><b id="rdHp" data-count="${d.peakHp}">0</b></div>
    <div class="acc-data"><span class="label">Peak torque</span><b id="rdTq" data-count="${d.peakTq}">0</b></div>
    <div class="acc-brand"><span class="label">Gain vs stock</span><b id="rdGain">+${d.gain}<span class="accent">%</span></b></div>
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

/* Discipline map — drives the brands-page filter. */
const CATS = {
  ecu:       ["link-ecu","hp-tuners","racechip","diablosport","viezu","ngk"],
  boost:     ["garrett","tial","hks","milltek","dbilas"],
  internals: ["je-pistons","manley","brian-crower","acl","arp","ferrea"],
  fuel:      ["injector-dynamics","mishimoto","sytec","red-horse","earls","samco"],
  chassis:   ["kw","d2-racing","cusco","megan-racing","tilton","clutch-masters"],
  cockpit:   ["work-wheels","zestino","sparco","autometer","cartech"],
};
const CAT_LABELS = {
  all: "All 34", ecu: "Engine management", boost: "Air &amp; exhaust",
  internals: "Internals", fuel: "Fuel &amp; cooling", chassis: "Chassis &amp; drivetrain", cockpit: "Wheels &amp; cockpit",
};
function catsFor(slug) {
  return Object.keys(CATS).filter(k => CATS[k].indexOf(slug) > -1).join(" ");
}

export function brandFilters() {
  return `<div class="filters" id="brandFilters" role="group" aria-label="Filter brands by discipline">
    ${Object.keys(CAT_LABELS).map((k, i) => `<button type="button" class="chip${i === 0 ? " is-on" : ""}" data-cat="${k}" aria-pressed="${i === 0}">${CAT_LABELS[k]}</button>`).join("")}
  </div>`;
}

export function brandGrid() {
  return `<div class="brand-grid">${BRANDS.map(b => `<div class="brand-cell" data-cat="${catsFor(b[1])}"><img src="assets/brands/${b[1]}.webp" alt="${b[0]}" title="${b[0]}" loading="lazy" width="120" height="46" /></div>`).join("")}</div>`;
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
export function pageHero({ eyebrow, title, lede, actions = "", accent = "acc-brand" }) {
  return `
<section class="hero hero--page ${accent}">
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
