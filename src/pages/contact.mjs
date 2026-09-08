import { page, SITE, ICON } from "../layout.mjs";
import { chapter, pageHero } from "../parts.mjs";

const body = `
${pageHero({
  accent: "acc-cyan",
  eyebrow: "07 / Contact",
  title: "Book the rollers.",
  lede: "Tell us about the car and what you want from it. We'll come back with a plan, a timeline and an honest price.",
})}

<section class="section" acc-cyan>
  <div class="wrap split split--top">

    <div class="rv">
      <p class="label label--red">Enquiry &amp; booking</p>
      <h2 class="mt-m h-md">Send us the details</h2>
      <form class="mt-l" id="mainForm" action="https://api.web3forms.com/submit" method="POST" novalidate>
        <input type="hidden" name="access_key" value="REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY" />
        <input type="hidden" name="subject" value="New enquiry — racing-dimensions.com" />
        <input type="hidden" name="from_name" value="Racing Dimensions website" />
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

        <div class="field-row">
          <div class="field"><label for="name">Name</label><input id="name" name="name" type="text" placeholder="Your name" required /></div>
          <div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" placeholder="+962 …" required /></div>
        </div>
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" placeholder="you@email.com" required /></div>
        <div class="field"><label for="vehicle">Vehicle</label><input id="vehicle" name="vehicle" type="text" placeholder="e.g. Nissan GT-R 2018" /></div>
        <div class="field">
          <label for="interest">What do you need</label>
          <select id="interest" name="interest">
            <option>Dyno session booking</option>
            <option>Custom ECU tuning</option>
            <option>Performance parts</option>
            <option>Engine build</option>
            <option>Diagnostics</option>
            <option>Something else</option>
          </select>
        </div>
        <div class="field"><label for="message">Details</label><textarea id="message" name="message" rows="4" placeholder="Current mods, goals, fuel you run…" required></textarea></div>

        <button class="btn" type="submit">Send enquiry ${ICON.arrow}</button>
        <p class="form-note" id="formNote" role="status"></p>
      </form>
    </div>

    <div class="rv rv-1">
      <div class="panel">
        <p class="label label--red">Direct</p>
        <table class="spec mt-m">
          <tbody>
            <tr><th scope="row">Phone · WhatsApp</th><td><a href="tel:${SITE.phoneRaw}">${SITE.phoneDisplay}</a></td></tr>
            <tr><th scope="row">Email</th><td><a href="mailto:${SITE.email}">${SITE.email}</a></td></tr>
            <tr><th scope="row">Workshop</th><td>${SITE.address}</td></tr>
            <tr><th scope="row">Hours <span id="openBadge"></span></th><td>Sat–Thu 09:00–19:00<br /><span class="muted">Friday closed</span></td></tr>
            <tr><th scope="row">Serving</th><td>All of Jordan · parts shipped nationwide</td></tr>
          </tbody>
        </table>
        <div class="hero-actions">
          <a class="btn" href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">WhatsApp ${ICON.arrow}</a>
          <a class="btn btn--ghost" href="tel:${SITE.phoneRaw}">Call now</a>
        </div>
      </div>
    </div>

  </div>
</section>

<section class="section pad-t0" acc-violet>
  <div class="wrap">
    ${chapter({ n: "Find us", title: "Al Sena'a Industrial Zone",
      lede: `<h2 class="chapter-title">Come and see the workshop.</h2>`,
      aside: `<p class="lede">We're in Amman's industrial quarter — easy to reach, and there's room to unload a trailer.</p>
      <a class="tlink mt-m" href="https://www.google.com/maps/dir/?api=1&amp;destination=Racing+Dimensions+Amman+Jordan" target="_blank" rel="noopener">Get directions ${ICON.arrow}</a>` })}
    <div class="rv map-frame">
      <iframe title="Racing Dimensions location on Google Maps — Amman, Jordan"
        src="https://maps.google.com/maps?q=Racing%20Dimensions%20Amman%20Jordan&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
        loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
  </div>
</section>`;

export default page({
  title: "Contact & Booking — Racing Dimensions | Amman, Jordan",
  desc: "Book a dyno session or enquire about performance parts and tuning. Al Sena'a Industrial Zone, Amman — serving all of Jordan.",
  current: "contact.html", body,
});
