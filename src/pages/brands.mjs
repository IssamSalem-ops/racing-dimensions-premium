import { page, ICON } from "../layout.mjs";
import { brandGrid, chapter, pageHero, BRANDS } from "../parts.mjs";

const GROUPS = [
  ["Engine management","Link ECU · HP Tuners · RaceChip · DiabloSport · Viezu"],
  ["Forced induction","Garrett · TiAL · HKS"],
  ["Engine internals","JE Pistons · Manley · Brian Crower · ACL · ARP · Ferrea"],
  ["Fuel &amp; cooling","Injector Dynamics · Mishimoto · Sytec · Red Horse · Earl's · Samco Sport"],
  ["Chassis &amp; drivetrain","KW · D2 Racing · Cusco · Megan Racing · Tilton · Clutch Masters"],
  ["Wheels, tyres &amp; cockpit","Work Wheels · Zestino · Sparco · AutoMeter · CarTech"],
];

const body = `
${pageHero({
  accent: "acc-violet",
  eyebrow: "04 / Partners",
  title: "34 names worth trusting.",
  lede: "Authorised supply, genuine stock, manufacturer warranty. No grey imports and no copies — because a fake rod bolt costs an engine.",
  actions: `<a class="btn" href="contact.html">Enquire about a brand ${ICON.arrow}</a>`
})}

<section class="section" acc-violet>
  <div class="wrap">
    ${chapter({ n: "The wall", title: "Every brand we carry",
      lede: `<h2 class="chapter-title">The people who make the parts.</h2>`,
      aside: `<p class="lede">${BRANDS.length} manufacturers across every corner of a build. If you need something we don't list, ask — we source direct.</p>` })}
  </div>
  <div class="wrap rv">${brandGrid()}</div>
</section>

<section class="section pad-t0" acc-magenta>
  <div class="wrap">
    ${chapter({ n: "By discipline", title: "Who we reach for",
      lede: `<h2 class="chapter-title">Matched to the job.</h2>`,
      aside: `<p class="lede">We don't have a favourite brand — we have a right answer for each application, budget and climate.</p>` })}
    <div class="cards cards--3 rv">
      ${GROUPS.map(([h, list], i) => `<article class="card"><span class="card-n">${String(i + 1).padStart(2, "0")}</span><h3>${h}</h3><p>${list}</p></article>`).join("")}
    </div>
    <div class="panel rv mt-l">
      <p class="label label--red">Authorised supply</p>
      <p class="lede mt-m measure-70">Every part is supplied genuine and covered by its manufacturer warranty. Ask us for the paperwork on anything you buy — we'd rather you check.</p>
    </div>
  </div>
</section>`;

export default page({
  title: "Brands — 34 Authorised Performance Partners | Racing Dimensions",
  desc: "Garrett, HKS, KW, Sparco, Link ECU, JE Pistons, ARP, Mishimoto and more — 34 authorised performance brands supplied genuine in Amman, Jordan.",
  current: "brands.html", body,
});
