import { page, ICON } from "../layout.mjs";
import { buildArt, chapter, pageHero } from "../parts.mjs";

const BUILDS = [
  { art:"turbo", tag:"Forced induction", h:"Garrett G-Series conversion", wide:true,
    spec:[["Platform","2.0T inline-four"],["Turbo","Garrett G-Series"],["Peak power","404 whp"],["Peak torque","328 lb-ft"],["Gain over stock","+38%"],["Management","Link ECU standalone"]],
    p:"A street car asked to behave on 98 RON and still pull to redline. New turbo, fuel system and intercooling, then mapped run by run until the curve was flat and the knock margin was honest." },
  { art:"engine", tag:"Engine build", h:"Forged bottom end",
    spec:[["Rods","Manley H-beam"],["Bearings","ACL Race"],["Hardware","ARP"],["Valvetrain","Ferrea"]],
    p:"Built to take boost without flinching — forged rods, race bearings and ARP hardware throughout, assembled and blueprinted in-house." },
  { art:"ecu", tag:"Engine management", h:"Standalone ECU retrofit",
    spec:[["ECU","Link"],["Sensors","Wideband, IAT, knock"],["Logging","Full-run datalog"]],
    p:"Factory ECU replaced with a standalone, fully sensored and logged so every change is measured rather than guessed at." },
  { art:"spring", tag:"Chassis", h:"Coilover &amp; geometry setup",
    spec:[["Dampers","KW"],["Alignment","Corner-balanced"],["Use","Street / track"]],
    p:"Ride height, damping and alignment set for Jordan's roads first and track days second — because most of the year it's a road car." },
  { art:"exhaust", tag:"Fabrication", h:"Custom exhaust system",
    spec:[["Material","Stainless"],["Design","Mandrel-bent"],["Fit","In-house"]],
    p:"Fabricated on the car rather than adapted from a kit — better clearance, better flow and a note that doesn't drone at cruise." },
  { art:"wheel", tag:"Wheels &amp; tyres", h:"Fitment &amp; tyre package",
    spec:[["Wheels","Work Wheels"],["Tyres","Zestino"],["Setup","Corner-balanced"]],
    p:"Offset and tyre chosen for grip and clearance under load — not just for how it sits in the car park." },
];

const body = `
${pageHero({
  eyebrow: "05 / Selected work",
  title: "Builds that left with proof.",
  lede: "A sample of what passes through the workshop. Every one of these ended on the rollers with a graph attached.",
  actions: `<a class="btn" href="contact.html">Start your build ${ICON.arrow}</a>`
})}

<section class="section">
  <div class="wrap">
    ${chapter({ n: "Portfolio", title: "The work",
      lede: `<h2 class="chapter-title">Street cars, race cars, and everything between.</h2>`,
      aside: `<p class="lede">Want your car featured here? Bring it in — if it makes a number worth showing, we'll put it on the wall.</p>` })}
    <div class="builds rv">
      ${BUILDS.map(b => `
      <article class="build${b.wide ? " build--wide" : ""}">
        ${buildArt(b.art)}
        <span class="build-tag">${b.tag}</span>
        <h3>${b.h}</h3>
        <div class="build-spec">${b.spec.slice(0, 3).map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join("")}</div>
      </article>`).join("")}
    </div>
  </div>
</section>

<section class="section pad-t0">
  <div class="wrap">
    ${chapter({ n: "Case study", title: "In detail",
      lede: `<h2 class="chapter-title">404 whp, and a curve you can drive.</h2>`,
      aside: `<p class="lede">${BUILDS[0].p}</p><a class="tlink mt-m" href="dyno.html">See the dyno graph ${ICON.arrow}</a>` })}
    <div class="split">
      <div class="rv">${buildArt("turbo").replace('class="build-art"', 'class="build-art build-art--static"')}</div>
      <div class="rv rv-1">
        <table class="spec">
          <tbody>${BUILDS[0].spec.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </div>
  </div>
</section>`;

export default page({
  title: "Builds — Selected Performance Work | Racing Dimensions Amman",
  desc: "Turbo conversions, forged engine builds, standalone ECU retrofits, suspension and fabrication work from the Racing Dimensions workshop in Amman, Jordan.",
  current: "builds.html", body,
});
