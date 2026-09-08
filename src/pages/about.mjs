import { page, SITE, ICON } from "../layout.mjs";
import { chapter, pageHero } from "../parts.mjs";

const VALUES = [
  ["01","Engineering first","Strong leadership, creativity and a relentless drive for real, repeatable performance — not headline numbers that don't survive the drive home."],
  ["02","Tuned to the owner","We monitor quality, appearance, sound and — of course — performance, staying in tune with what enthusiasts actually want from their car."],
  ["03","Proven on the dyno","Every build is validated on our own dynamometer. If we can't measure it, we won't claim it."],
  ["04","Genuine parts only","Authorised supply with manufacturer warranty. A counterfeit part is the most expensive thing you can put in an engine."],
];

const body = `
${pageHero({
  accent: "acc-gold",
  eyebrow: "06 / About",
  title: "Two decades in Al Sena'a.",
  lede: `Racing Dimensions has served motorsport competitors, car tuners and motorcycle enthusiasts from Amman since ${SITE.since}.`,
  actions: `<a class="btn" href="contact.html">Visit the workshop ${ICON.arrow}</a>`
})}

<section class="section" acc-gold>
  <div class="wrap split">
    <div class="rv">
      <p class="label label--red">The story</p>
      <h2 class="mt-m h-lg measure-14">Built by drivers, for drivers.</h2>
    </div>
    <div class="rv rv-1 stack">
      <p class="lede">For two decades we have focused entirely on one exciting, high-octane and innovative market — developing an unrivalled product portfolio and an exceptional level of expertise along the way.</p>
      <p class="muted">What started as a parts counter grew into a full workshop: sourcing, fitting, fabricating, mapping and finally proving the result on our own rollers. That last step is the one most shops skip, and it's the reason people drive across Jordan to get here.</p>
      <p class="muted">From street builds to full race cars, we source, supply and dyno-tune the parts that make real power — and we tell customers honestly when a stage isn't worth the money.</p>
    </div>
  </div>
</section>

<section class="section pad-t0" acc-lime>
  <div class="wrap">
    ${chapter({ n: "Principles", title: "How we work",
      lede: `<h2 class="chapter-title">Four things we don't compromise.</h2>` })}
    <div class="cards cards--2 rv">
      ${VALUES.map(([n, h, p]) => `<article class="card"><span class="card-n">${n}</span><h3>${h}</h3><p>${p}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section pad-t0" acc-cyan>
  <div class="wrap">
    <div class="panel rv">
      <p class="label label--red">Where we are</p>
      <h2 class="mt-m h-md">${SITE.address}</h2>
      <p class="lede mt-m">We serve customers across Jordan — parts ship nationwide, and workshop, tuning and dyno work happens here in Amman.</p>
      <div class="hero-actions"><a class="btn" href="contact.html">Directions &amp; hours ${ICON.arrow}</a></div>
    </div>
  </div>
</section>`;

export default page({
  title: "About — Racing Since 2003 | Racing Dimensions Amman",
  desc: "Racing Dimensions has supplied performance parts and dyno tuning to motorsport competitors and car tuners across Jordan from Al Sena'a, Amman, since 2003.",
  current: "about.html", body,
});
