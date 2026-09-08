/* Racing Dimensions — interaction layer. CSP-safe (external, no inline). */
(function () {
  "use strict";

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = matchMedia("(pointer: fine)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Header stuck + scroll progress ---- */
  var hdr = $("#hdr"), prog = $("#prog"), ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle("is-stuck", y > 24);
    if (prog) {
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    }
    ticking = false;
  }
  addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Overlay menu ---- */
  var menu = $("#menu"), mBtn = $("#menuBtn"), lastFocus = null;
  function setMenu(open) {
    if (!menu || !mBtn) return;
    menu.classList.toggle("is-open", open);
    mBtn.classList.toggle("is-open", open);
    mBtn.setAttribute("aria-expanded", open ? "true" : "false");
    mBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { lastFocus = document.activeElement; var f = $("a", menu); if (f) f.focus(); }
    else if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (mBtn) mBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("is-open")) setMenu(false);
    if (e.key === "Tab" && menu && menu.classList.contains("is-open")) {
      var f = $$('a, button', menu).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---- Reveal on scroll ---- */
  var revealObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      obs.unobserve(e.target);
      if (e.target.hasAttribute("data-count") || $("[data-count]", e.target)) countIn(e.target);
      drawIn(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".rv").forEach(function (el) { revealObs.observe(el); });

  /* ---- Counters ---- */
  function animate(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target; return; }
    var plain = el.hasAttribute("data-plain");
    var start = plain ? target - 22 : 0, t0 = null, dur = 1500;
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    })(performance.now());
  }
  function countIn(scope) {
    if (scope.hasAttribute && scope.hasAttribute("data-count")) animate(scope);
    $$("[data-count]", scope).forEach(animate);
  }
  // stat band sits outside .rv — observe directly
  var statObs = new IntersectionObserver(function (en, o) {
    en.forEach(function (e) { if (e.isIntersecting) { animate(e.target); o.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$(".stat [data-count], .stat-n[data-count]").forEach(function (el) { statObs.observe(el); });

  /* ---- Dyno curve draw-on ---- */
  function drawIn(scope) {
    $$("[data-draw]", scope).forEach(function (p) {
      var len;
      try { len = p.getTotalLength(); } catch (err) { return; }
      if (!len) return;
      if (reduce) return;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      // force layout, then release
      void p.getBoundingClientRect();
      p.style.transition = "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)";
      requestAnimationFrame(function () { p.style.strokeDashoffset = "0"; });
    });
  }

  /* ---- Hero intro + parallax ---- */
  var hero = $("#hero") || $(".hero");
  if (hero) requestAnimationFrame(function () { hero.classList.add("is-ready"); });
  var glow = $("#heroGlow");
  if (glow && fine && !reduce && hero) {
    var gx = 0, gy = 0, gRaf = false;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      gx = ((e.clientX - r.left) / r.width - 0.5) * 44;
      gy = ((e.clientY - r.top) / r.height - 0.5) * 30;
      if (!gRaf) {
        requestAnimationFrame(function () { glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)"; gRaf = false; });
        gRaf = true;
      }
    });
    hero.addEventListener("pointerleave", function () { glow.style.transform = ""; });
  }

  /* ---- Accordion ---- */
  $$(".acc-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0";
    });
  });

  /* ---- Open / closed badge (Amman time) ---- */
  var badge = document.getElementById("openBadge");
  if (badge) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Amman", weekday: "short", hour: "2-digit", hour12: false }).formatToParts(new Date());
      var wd = "", hh = 0;
      parts.forEach(function (p) { if (p.type === "weekday") wd = p.value; if (p.type === "hour") hh = parseInt(p.value, 10); });
      if (hh === 24) hh = 0;
      var open = wd !== "Fri" && hh >= 9 && hh < 19;
      badge.textContent = open ? "· Open now" : "· Closed";
      badge.style.color = open ? "#3ddc84" : "var(--muted-2)";
    } catch (e) {}
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Form: Web3Forms with graceful mailto fallback ---- */
  var form = document.getElementById("mainForm"), note = document.getElementById("formNote");
  var WA = "+962 7 9554 3492", MAIL = "sales@racing-dimensions.com";
  function say(msg, ok) { if (!note) return; note.textContent = msg; note.classList.toggle("is-ok", !!ok); }
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var el = form.elements;
      var need = ["name", "phone", "email", "message"];
      for (var i = 0; i < need.length; i++) {
        if (!el[need[i]] || !el[need[i]].value.trim()) { say("Please fill in your name, phone, email and details.", false); el[need[i]].focus(); return; }
      }
      var key = el["access_key"] ? el["access_key"].value : "";
      var v = function (n) { return el[n] && el[n].value ? el[n].value : "—"; };

      if (!key || /REPLACE/i.test(key)) {
        var subject = encodeURIComponent("Website enquiry — " + v("interest") + " (" + v("name") + ")");
        var bodyTxt = encodeURIComponent(
          "Name: " + v("name") + "\nPhone: " + v("phone") + "\nEmail: " + v("email") +
          "\nVehicle: " + v("vehicle") + "\nNeeds: " + v("interest") + "\n\n" + v("message"));
        location.href = "mailto:" + MAIL + "?subject=" + subject + "&body=" + bodyTxt;
        say("Opening your email app… or WhatsApp us on " + WA + ".", true);
        return;
      }
      var data = {}; new FormData(form).forEach(function (val, k) { data[k] = val; });
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      say("Sending…", false);
      fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && res.success) { say("Thanks — we'll come back to you shortly.", true); form.reset(); }
        else say(((res && res.message) || "Something went wrong.") + " You can also WhatsApp " + WA + ".", false);
      }).catch(function () { say("Network error — please WhatsApp us on " + WA + ".", false); })
        .finally(function () { if (btn) btn.disabled = false; });
    });
  }
})();
