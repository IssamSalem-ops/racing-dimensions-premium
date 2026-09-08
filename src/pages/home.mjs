import { page, SITE, ICON } from "../layout.mjs";
import { dynoChart, brandMarquee, buildArt, chapter } from "../parts.mjs";

const jsonld = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"AutoPartsStore","name":"Racing Dimensions",
"description":"Performance tuning parts, engine management and a professional in-house Dyno Center in Amman, Jordan.",
"url":"${SITE.domain}","telephone":"${SITE.phoneRaw}","email":"${SITE.email}","foundingDate":"${SITE.since}","priceRange":"$$",
"address":{"@type":"PostalAddress","streetAddress":"Al Sena'a Industrial Zone","addressLocality":"Amman","addressCountry":"JO"},
"areaServed":["Jordan"],
"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"],"opens":"09:00","closes":"19:00"}]}
</script>`;

const CAPS = [
  ["01","Dyno Center","Load-bearing rollers, wideband logging and a printed power graph. The only honest way to prove a build.","dyno.html"],
  ["02","Custom ECU Mapping","Standalone, piggyback and factory-ECU remaps written on the rollers for your fuel, your climate, your goals.","services.html"],
  ["03","Performance Parts","20 categories across 34 authorised brands — turbochargers, internals, suspension, brakes, wheels, racewear.","brands.html"],
  ["04","Engine Building","Forged bottom ends, head work and blueprinting for engines that survive the power they make.","services.html"],
  ["05","Fabrication & Fitment","Exhaust systems, intakes, intercooling and hard lines — fabricated and fitted in-house.","services.html"],
  ["06","Diagnostics","Full scan, compression and health check before you spend a dinar on power.","services.html"],
];

const body = `
<section class="hero" id="hero">
  <div class="hero-bg" aria-hidden="true">
    <div class="hero-glow" id="heroGlow"></div>
    <div class="hero-grid"></div>
    <div class="hero-vig"></div>
  </div>
  <div class="wrap hero-in">
    <p class="label label--red rv">Tuning Parts &amp; Dyno Center · Amman, Jordan</p>
    <h1 class="hero-title display">
      <span class="ln"><span>We build</span></span>
      <span class="ln"><span class="accent">power.</span></span>
    </h1>
    <div class="hero-meta">
      <p class="hero-sub">Since ${SITE.since}, Jordan's performance workshop for people who want numbers, not claims. Parts sourced from the world's best. Power proven on our own dyno.</p>
      <div class="hero-actions hero-actions--flush">
        <a class="btn" href="dyno.html">Book a dyno session ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="builds.html">See the builds</a>
      </div>
    </div>
  </div>
  <div class="scroll-cue" aria-hidden="true"><span>Scroll</span><span class="bar"></span></div>
</section>

<section class="stats">
  <div class="wrap wrap--flush">
    <div class="stats-grid">
      <div class="stat"><span class="stat-n" data-count="2003" data-plain>2003</span><span class="stat-l">Racing since</span></div>
      <div class="stat"><span class="stat-n"><span data-count="34">0</span><em>+</em></span><span class="stat-l">Authorised brands</span></div>
      <div class="stat"><span class="stat-n" data-count="20">0</span><span class="stat-l">Part categories</span></div>
      <div class="stat"><span class="stat-n"><span data-count="100">0</span><em>%</em></span><span class="stat-l">Genuine parts</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${chapter({
      n: "01 / Capabilities",
      title: "What we do",
      lede: `<h2 class="chapter-title">Everything that makes power — under one roof.</h2>`,
      aside: `<p class="lede">Most shops sell you a part. We take responsibility for the whole outcome: the spec, the fitment, the map, and the number on the graph at the end of it.</p>`
    })}
    <div class="index">
      ${CAPS.map(([n, h, p, href]) => `
      <a class="index-row" href="${href}">
        <span class="index-n">${n}</span>
        <span class="index-h">${h}</span>
        <span class="index-p">${p}</span>
        <span class="index-go">${ICON.arrow}</span>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="section section--panel">
  <div class="wrap">
    ${chapter({
      n: "02 / Dyno Center",
      title: "Proof, not promises",
      lede: `<h2 class="chapter-title">The number is the whole point.</h2>`,
      aside: `<p class="lede">Every build we touch ends on the rollers. You leave with a printed graph, a logged run, and a map written for the car you actually drive — not a generic file.</p>
        <a class="tlink mt-m" href="dyno.html">Inside the Dyno Center ${ICON.arrow}</a>`
    })}
    ${dynoChart()}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${chapter({
      n: "03 / Partners",
      title: "The brands we carry",
      lede: `<h2 class="chapter-title">Authorised. Genuine. Warrantied.</h2>`,
      aside: `<p class="lede">34 of motorsport's most respected names — supplied genuine, with manufacturer warranty. No grey imports, no copies.</p>
        <a class="tlink mt-m" href="brands.html">All brands ${ICON.arrow}</a>`
    })}
  </div>
  <div class="mt-l">${brandMarquee()}</div>
</section>

<section class="section pad-t0">
  <div class="wrap">
    ${chapter({
      n: "04 / Selected work",
      title: "Recent builds",
      lede: `<h2 class="chapter-title">Cars that left with more than they came with.</h2>`,
      aside: `<p class="lede">A look at what passes through the workshop — from staged street cars to full competition engines.</p>
        <a class="tlink mt-m" href="builds.html">Every build ${ICON.arrow}</a>`
    })}
    <div class="builds rv">
      <article class="build build--wide">
        ${buildArt("turbo")}
        <span class="build-tag">Forced induction</span>
        <h3>Garrett G-Series conversion</h3>
        <div class="build-spec"><span>Peak <b>404 whp</b></span><span>Gain <b>+38%</b></span><span>Fuel <b>98 RON</b></span></div>
      </article>
      <article class="build">
        ${buildArt("engine")}
        <span class="build-tag">Engine build</span>
        <h3>Forged 2.0T bottom end</h3>
        <div class="build-spec"><span>Rods <b>Manley</b></span><span>Bolts <b>ARP</b></span></div>
      </article>
      <article class="build">
        ${buildArt("ecu")}
        <span class="build-tag">Engine management</span>
        <h3>Link ECU standalone</h3>
        <div class="build-spec"><span>Map <b>Custom</b></span><span>Logging <b>Wideband</b></span></div>
      </article>
    </div>
  </div>
</section>

<section class="section pad-t0">
  <div class="wrap">
    <div class="panel rv">
      <p class="label label--red">From the workshop floor</p>
      <blockquote class="display pull-quote">
        Strong leadership, engineering genius and a willingness to listen.
      </blockquote>
      <p class="lede mt-m">Those are the pillars this company was built on in ${SITE.since} — and they are still the reason cars keep coming back.</p>
    </div>
  </div>
</section>`;

export default page({
  title: "Racing Dimensions — Performance Tuning Parts & Dyno Center | Amman, Jordan",
  desc: "Jordan's performance workshop since 2003. Tuning parts from 34 authorised brands, custom ECU mapping and a professional in-house Dyno Center in Amman.",
  current: "index.html",
  body, jsonld,
});
