import { page, ICON } from "../layout.mjs";
import { chapter, pageHero, buildArt } from "../parts.mjs";

const SERVICES = [
  ["01","Dyno tuning &amp; mapping","Custom maps written on our rollers for standalone ECUs, piggyback systems and factory remaps. Logged, verified and handed over with the graph.","dyno.html"],
  ["02","Performance parts supply","20 categories across 34 authorised brands. If it makes power, holds power or stops it, we source it genuine and warrantied.","brands.html"],
  ["03","Engine building","Forged bottom ends, head work, valvetrain and blueprinting — built to survive the power you asked for.","contact.html"],
  ["04","Forced induction","Turbo and supercharger conversions, manifold and intercooling design, boost control and fuelling to match.","contact.html"],
  ["05","Fabrication","Exhaust systems, intakes, charge piping and hard lines fabricated in-house to fit your car properly.","contact.html"],
  ["06","Suspension &amp; brakes","Coilovers, geometry, bushings, big-brake kits and pads — set up for how and where you actually drive.","contact.html"],
  ["07","Diagnostics &amp; health checks","Full scan, compression and leak-down before you spend money on power. Find the fault first.","contact.html"],
  ["08","Build consultation","Free. Tell us the goal and the budget and we'll map the stages honestly — including when to stop.","contact.html"],
];

const CATEGORIES = ["Brake Pads","Exhaust System","Fuel System","Cooling System","Fittings &amp; Hoses","Engine Parts","Electrical Components","Engine Management","Racewear","Gauges","Oils","Race Seats &amp; Belts","Wheels &amp; Tyres","Accessories","Suspension","Intake","Clutches &amp; Flywheels","Steering Wheels","Air Filter","Heat Shielding"];

const body = `
${pageHero({
  accent: "acc-lime",
  eyebrow: "03 / Services",
  title: "From a single part to a whole engine.",
  lede: "Two decades of doing one thing: making cars in Jordan faster, safer and more reliable than they left the factory.",
  actions: `<a class="btn" href="contact.html">Talk to the team ${ICON.arrow}</a>`
})}

<section class="section acc-lime">
  <div class="wrap">
    ${chapter({ n: "Capability", title: "The full list",
      lede: `<h2 class="chapter-title">What we take on.</h2>`,
      aside: `<p class="lede">Everything below happens in our own workshop in Al Sena'a. Nothing is sublet, so nothing gets lost between two shops blaming each other.</p>` })}
    <div class="index">
      ${SERVICES.map(([n, h, p, href]) => `
      <a class="index-row" href="${href}">
        <span class="index-n">${n}</span><span class="index-h">${h}</span>
        <span class="index-p">${p}</span><span class="index-go">${ICON.arrow}</span>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="section pad-t0 acc-cyan">
  <div class="wrap">
    ${chapter({ n: "Catalogue", title: "Parts categories",
      lede: `<h2 class="chapter-title">Twenty categories, stocked and sourced.</h2>`,
      aside: `<p class="lede">Ask for anything on this list. If it isn't on the shelf, we'll source it from the manufacturer and tell you honestly how long it takes.</p>
        <a class="tlink mt-m" href="brands.html">See the brands ${ICON.arrow}</a>` })}
    <div class="cards cards--3 cards--auto rv">
      ${CATEGORIES.map((c, i) => `<div class="card card--tight"><span class="card-n">${String(i + 1).padStart(2, "0")}</span><h3>${c}</h3></div>`).join("")}
    </div>
  </div>
</section>

<section class="section pad-t0 acc-violet">
  <div class="wrap">
    <div class="builds rv">
      <article class="build">${buildArt("spring")}<span class="build-tag">Chassis</span><h3>Suspension &amp; geometry</h3></article>
      <article class="build">${buildArt("exhaust")}<span class="build-tag">Fabrication</span><h3>Exhaust &amp; charge piping</h3></article>
    </div>
  </div>
</section>`;

export default page({
  title: "Services — Tuning, Engine Building & Fabrication | Racing Dimensions",
  desc: "Dyno tuning, ECU mapping, engine building, forced induction, fabrication, suspension and diagnostics — all in-house at Racing Dimensions, Amman, Jordan.",
  current: "services.html", body,
});
