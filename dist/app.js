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
      badge.style.color = open ? "var(--c-ok)" : "var(--muted-2)";
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

/* =========================================================================
   Motion + interaction layer
   ========================================================================= */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = matchMedia("(pointer: fine)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- 1. Word-stagger reveals on headings ---- */
  if (!reduce) {
    $$(".chapter-title, .page-title, .ftr-cta h2").forEach(function (el) {
      if (el.children.length) return;                  // skip headings with nested markup
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = "";
      words.forEach(function (w, i) {
        var outer = document.createElement("span");
        outer.className = "w";
        var inner = document.createElement("span");
        inner.textContent = w;
        inner.style.transitionDelay = (i * 0.045).toFixed(3) + "s";
        outer.appendChild(inner);
        el.appendChild(outer);
        el.appendChild(document.createTextNode(" "));
      });
    });
  }

  /* ---- 2. Custom cursor ---- */
  if (fine && !reduce) {
    var ring = document.createElement("div"); ring.className = "cur";
    var dot  = document.createElement("div"); dot.className  = "cur-dot";
    document.body.appendChild(ring); document.body.appendChild(dot);
    document.body.classList.add("has-cursor");
    var cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
    addEventListener("pointermove", function (e) {
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
    }, { passive: true });
    (function loop() {
      rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest("a, button, .dyno-hit, .brand-mark, .build");
      ring.classList.toggle("is-big", !!t);
    });
  }

  /* ---- 3. Magnetic buttons ---- */
  if (fine && !reduce) {
    $$(".btn, .stage-btn, .chip").forEach(function (b) {
      var raf = false, tx = 0, ty = 0;
      function apply() { b.style.transform = "translate(" + tx + "px," + ty + "px)"; raf = false; }
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 12;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 8;
        if (!raf) { requestAnimationFrame(apply); raf = true; }
      });
      b.addEventListener("pointerleave", function () { tx = ty = 0; b.style.transform = ""; });
    });
  }

  /* ---- 4. Scroll-linked hero ---- */
  var heroIn = $(".hero-in"), heroEl = $(".hero");
  if (heroIn && heroEl && !reduce) {
    var hTick = false;
    addEventListener("scroll", function () {
      if (hTick) return;
      hTick = true;
      requestAnimationFrame(function () {
        var h = heroEl.offsetHeight || 1;
        var p = Math.min(Math.max(scrollY / h, 0), 1);
        heroIn.style.transform = "translate3d(0," + (p * -70).toFixed(1) + "px,0)";
        heroIn.style.opacity = (1 - p * 1.25).toFixed(3);
        hTick = false;
      });
    }, { passive: true });
  }

  /* ---- 5. Page transition ---- */
  if (!reduce) {
    var wipe = document.createElement("div");
    wipe.className = "wipe";
    document.body.appendChild(wipe);
    requestAnimationFrame(function () { wipe.classList.add("is-in"); });
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (/^(#|tel:|mailto:|https?:\/\/)/i.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      wipe.classList.remove("is-in");
      wipe.classList.add("is-out");
      setTimeout(function () { location.href = href; }, 480);
    });
    addEventListener("pageshow", function (ev) {
      if (ev.persisted) { wipe.classList.remove("is-out"); wipe.classList.add("is-in"); }
    });
  }

  /* ---- 6. Interactive dyno ---- */
  var dyno = $(".dyno");
  if (dyno) {
    var D;
    try { D = JSON.parse(dyno.getAttribute("data-dyno")); } catch (e) { D = null; }
    if (D) {
      var G = D.geo, RPM = D.rpm, cur = "s2";
      var svg = $("svg", dyno), hit = $("#dynoHit", dyno);
      var pHp = $("#dynoHp", dyno), pTq = $("#dynoTq", dyno), pAr = $("#dynoArea", dyno);
      var line = $("#crossLine", dyno), cHp = $("#crossHp", dyno), cTq = $("#crossTq", dyno);
      var live = $("#dynoLive", dyno), rdHp = $("#rdHp", dyno), rdTq = $("#rdTq", dyno), rdGain = $("#rdGain", dyno);
      var pxF = function (r) { return G.L + ((r - G.minX) / (G.maxX - G.minX)) * (G.W - G.L - G.R); };
      var pyF = function (v) { return G.H - G.B - (v / G.maxY) * (G.H - G.T - G.B); };

      function redraw(p) {
        if (reduce) return;
        var len;
        try { len = p.getTotalLength(); } catch (e) { return; }
        p.style.transition = "none";
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        void p.getBoundingClientRect();
        p.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)";
        requestAnimationFrame(function () { p.style.strokeDashoffset = "0"; });
      }
      function countTo(el, target) {
        if (!el) return;
        if (reduce) { el.textContent = target; return; }
        var from = parseInt(el.textContent, 10) || 0, t0 = null, dur = 700;
        (function step(ts) {
          if (!t0) t0 = ts;
          var q = Math.min((ts - t0) / dur, 1), e2 = 1 - Math.pow(1 - q, 3);
          el.textContent = Math.round(from + (target - from) * e2);
          if (q < 1) requestAnimationFrame(step);
        })(performance.now());
      }
      function setStage(key) {
        var s = D.stages[key];
        if (!s) return;
        cur = key;
        pHp.setAttribute("d", s.hpPath);
        pTq.setAttribute("d", s.tqPath);
        pAr.setAttribute("d", s.areaPath);
        redraw(pHp); redraw(pTq);
        countTo(rdHp, s.peakHp); countTo(rdTq, s.peakTq);
        if (rdGain) rdGain.innerHTML = "+" + s.gain + '<span class="accent">%</span>';
        $$(".stage-btn", dyno).forEach(function (b) {
          var on = b.getAttribute("data-stage") === key;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        if (live) live.textContent = s.label + " · 2.0T";
      }
      $$(".stage-btn", dyno).forEach(function (b) {
        b.addEventListener("click", function () { setStage(b.getAttribute("data-stage")); });
      });

      function valueAt(arr, rpm) {
        if (rpm <= RPM[0]) return arr[0];
        if (rpm >= RPM[RPM.length - 1]) return arr[arr.length - 1];
        for (var i = 0; i < RPM.length - 1; i++) {
          if (rpm >= RPM[i] && rpm <= RPM[i + 1]) {
            var t = (rpm - RPM[i]) / (RPM[i + 1] - RPM[i]);
            return arr[i] + (arr[i + 1] - arr[i]) * t;
          }
        }
        return arr[arr.length - 1];
      }
      function scrub(clientX) {
        var r = svg.getBoundingClientRect();
        var sx = (clientX - r.left) / r.width * G.W;
        sx = Math.max(G.L, Math.min(G.W - G.R, sx));
        var rpm = G.minX + ((sx - G.L) / (G.W - G.L - G.R)) * (G.maxX - G.minX);
        var s = D.stages[cur];
        var hp = valueAt(s.hp, rpm), tq = valueAt(s.tq, rpm);
        line.setAttribute("x1", sx); line.setAttribute("x2", sx);
        cHp.setAttribute("cx", sx); cHp.setAttribute("cy", pyF(hp));
        cTq.setAttribute("cx", sx); cTq.setAttribute("cy", pyF(tq));
        if (live) live.textContent = Math.round(rpm / 50) * 50 + " rpm · " + Math.round(hp) + " whp · " + Math.round(tq) + " lb-ft";
      }
      hit.addEventListener("pointerenter", function () { dyno.classList.add("is-scrubbing"); });
      hit.addEventListener("pointermove", function (e) { scrub(e.clientX); });
      hit.addEventListener("pointerdown", function (e) { dyno.classList.add("is-scrubbing"); scrub(e.clientX); });
      hit.addEventListener("pointerleave", function () {
        dyno.classList.remove("is-scrubbing");
        if (live) live.textContent = D.stages[cur].label + " · 2.0T";
      });
    }
  }

  /* ---- 7. Brand filter ---- */
  var filters = $("#brandFilters");
  if (filters) {
    var cells = $$(".brand-cell");
    filters.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var cat = chip.getAttribute("data-cat");
      $$(".chip", filters).forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      cells.forEach(function (cell) {
        var show = cat === "all" || (cell.getAttribute("data-cat") || "").split(" ").indexOf(cat) > -1;
        cell.classList.toggle("is-hidden", !show);
      });
    });
  }
})();
