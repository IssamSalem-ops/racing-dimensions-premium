import { page, ICON } from "../layout.mjs";
import { dynoChart, chapter, faq, pageHero } from "../parts.mjs";

const STEPS = [
  ["01","Strap down &amp; baseline","The car is secured to the rollers and we take a baseline run — the honest starting number, before anything changes."],
  ["02","Log &amp; inspect","Wideband AFR, boost, knock and intake temps are logged live. We look for the problems before we chase the power."],
  ["03","Map on the rollers","Fuel, ignition and boost written run by run for your fuel and Jordan's climate — not a file bought off the internet."],
  ["04","Verify &amp; hand over","Final pulls, a printed HP/torque graph and the logs. You leave knowing exactly what the car makes."],
];

const body = `
${pageHero({
  accent: "acc-orange",
  eyebrow: "02 / Dyno Center",
  title: "The rollers don't argue.",
  lede: "A professional in-house dynamometer — the only equipment that turns an opinion about your car into a number you can trust.",
  actions: `<a class="btn" href="contact.html">Book a session ${ICON.arrow}</a><a class="btn btn--ghost" href="services.html">See all services</a>`
})}

<section class="section acc-orange">
  <div class="wrap">
    ${chapter({
      n: "Output", title: "A real run",
      lede: `<h2 class="chapter-title">What a session gives you.</h2>`,
      aside: `<p class="lede">Peak figures matter, but the shape of the curve matters more. A car that makes its torque early and holds it is faster on the road than a peaky headline number.</p>`
    })}
    ${dynoChart()}
  </div>
</section>

<section class="section pad-t0 acc-gold">
  <div class="wrap">
    ${chapter({ n: "Process", title: "How a session runs",
      lede: `<h2 class="chapter-title">Four stages, one afternoon.</h2>`,
      aside: `<p class="lede">Most tunes are completed in a day. Bring the car with at least a quarter tank of the fuel you actually run.</p>` })}
    <div class="cards cards--2 rv">
      ${STEPS.map(([n, h, p]) => `<article class="card"><span class="card-n">${n}</span><h3>${h}</h3><p>${p}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section pad-t0 acc-lime">
  <div class="wrap split">
    <div class="rv">
      <p class="label label--red">What it costs</p>
      <h2 class="mt-m h-lg">Dyno &amp; tuning rates</h2>
      <p class="lede mt-m">Indicative rates in Jordanian dinar. The final quote depends on the platform, the parts fitted and how far you want to take it.</p>
      <a class="btn mt-l" href="contact.html">Request an exact quote ${ICON.arrow}</a>
    </div>
    <div class="rv rv-1">
      <div class="price-row"><h3>Power run &amp; graph</h3><span class="price-v">40 <small>JOD</small></span><p>A full baseline pull with a printed HP and torque graph.</p></div>
      <div class="price-row"><h3>Custom ECU tune</h3><span class="price-v">150 <small>JOD</small></span><p>Bespoke mapping written on the rollers, verified over multiple runs.</p></div>
      <div class="price-row"><h3>Diagnostic session</h3><span class="price-v">20 <small>JOD</small></span><p>Full scan, health check and a logged run to find what's holding the car back.</p></div>
      <div class="price-row"><h3>Build consultation</h3><span class="price-v">Free</span><p>Sit with the team and plan the build stage by stage before you spend anything.</p></div>
    </div>
  </div>
</section>

<section class="section pad-t0 acc-cyan">
  <div class="wrap">
    ${chapter({ n: "Questions", title: "Before you book", lede: `<h2 class="chapter-title">Good to know.</h2>` })}
    ${faq([
      { q: "Do I need an appointment?", a: "Yes — sessions are booked so we can reserve the rollers and prep for your car. Book through the form or send us a WhatsApp and we'll confirm a slot." },
      { q: "How long does a custom tune take?", a: "Most tunes are completed within a day, depending on the platform, the parts fitted and your goals. We'll give you a clear timeline when you book." },
      { q: "What should I bring?", a: "The car, at least a quarter tank of the fuel you actually run, and any details of previous tuning or modifications. If the car has a known fault, tell us first." },
      { q: "Can you tune a car you didn't build?", a: "Absolutely. We tune cars built elsewhere every week — we'll baseline and inspect it first so there are no surprises." },
      { q: "Do you tune motorcycles?", a: "Yes. Racing Dimensions has served motorcycle enthusiasts alongside car tuners since 2003." },
    ])}
  </div>
</section>`;

export default page({
  title: "Dyno Center — Rolling Road & Custom ECU Tuning | Racing Dimensions Amman",
  desc: "Professional in-house dynamometer in Amman. Baseline runs, wideband logging and custom ECU mapping written on the rollers, with a printed HP and torque graph.",
  current: "dyno.html", body,
});
