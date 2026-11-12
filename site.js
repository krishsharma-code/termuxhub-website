/* ==========================================================================
   Termux Hub — site.js
   Shared enhancements loaded by every page:
     - Copy-to-clipboard buttons on all code blocks (works offline in the app)
     - Mobile slide-out menu (hamburger)
     - Theme toggle (light / dark) with persistence
     - Reading-progress bar + back-to-top button
     - Active nav highlighting
   Safe to load on pages that already implement some of these.
   ========================================================================== */
(function () {
  "use strict";
  var d = document;

  function ready(fn) {
    if (d.readyState !== "loading") { fn(); }
    else { d.addEventListener("DOMContentLoaded", fn); }
  }

  /* ------------------------------------------------------------ clipboard */
  function legacyCopy(text) {
    try {
      var ta = d.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.left = "-1000px";
      ta.style.opacity = "0";
      d.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = d.execCommand("copy");
      d.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  function doCopy(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { resolve(true); },
          function () { resolve(legacyCopy(text)); }
        );
      } else {
        resolve(legacyCopy(text));
      }
    });
  }

  function flash(label) {
    if (label.dataset.busy) { return; }
    label.dataset.busy = "1";
    if (!label.dataset.orig) { label.dataset.orig = label.textContent; }
    label.textContent = "COPIED \u2713";
    label.classList.add("copied");
    setTimeout(function () {
      label.textContent = label.dataset.orig;
      label.classList.remove("copied");
      delete label.dataset.busy;
    }, 1600);
  }

  function bindCopy(label, getText) {
    if (label.dataset.copyBound) { return; }
    label.dataset.copyBound = "1";
    label.setAttribute("role", "button");
    label.setAttribute("tabindex", "0");
    label.setAttribute("title", "Copy to clipboard");
    function go(e) {
      if (e) { e.preventDefault(); }
      doCopy(getText()).then(function () { flash(label); });
    }
    label.addEventListener("click", go);
    label.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { go(e); }
    });
  }

  function guessLang(txt) {
    if (/^\s*(\$|pkg |apt |nmap |git |cd |ls |mkdir |echo |curl |wget |pip |nano |chmod |python -)/m.test(txt)) { return "BASH \u2014 TERMINAL"; }
    if (/^\s*(def |import |from |class )/m.test(txt)) { return "PYTHON"; }
    if (/^\s*(#include|int main|std::|using namespace)/m.test(txt)) { return "C++"; }
    if (/^\s*(function |const |let |var |=>)/m.test(txt)) { return "JAVASCRIPT"; }
    return "CODE";
  }

  function enhanceCode() {
    var pres = d.querySelectorAll("pre");
    Array.prototype.forEach.call(pres, function (pre) {
      var block = pre.closest ? pre.closest(".code-block") : null;
      if (!block) {
        block = d.createElement("div");
        block.className = "code-block";
        var header = d.createElement("div");
        header.className = "code-block-header";
        var lang = d.createElement("span");
        lang.className = "code-lang";
        lang.textContent = guessLang(pre.textContent || "");
        var lbl = d.createElement("span");
        lbl.className = "copy-label";
        lbl.textContent = "COPY CODE";
        header.appendChild(lang);
        header.appendChild(lbl);
        pre.parentNode.insertBefore(block, pre);
        block.appendChild(header);
        block.appendChild(pre);
      }
      var label = block.querySelector(".copy-label");
      if (!label) {
        var h = block.querySelector(".code-block-header");
        if (!h) {
          h = d.createElement("div");
          h.className = "code-block-header";
          block.insertBefore(h, block.firstChild);
        }
        label = d.createElement("span");
        label.className = "copy-label";
        label.textContent = "COPY CODE";
        h.appendChild(label);
      }
      bindCopy(label, function () { return pre.innerText; });
    });
  }

  /* ----------------------------------------------------------- mobile menu */
  function ensureMenu() {
    var header = d.querySelector("header");
    if (!header) { return; }
    /* If the page already ships a hamburger, it manages its own menu. */
    if (d.getElementById("hamburger")) { return; }

    var side = d.getElementById("sideNav");
    if (!side) {
      side = d.createElement("div");
      side.className = "side-nav";
      side.id = "sideNav";
      side.innerHTML =
        '<a href="index.html">[[ HOME ]]</a>' +
        '<a href="cheatsheet.html">[[ CHEATSHEET ]]</a>' +
        '<a href="kali-toolkit.html">[[ KALI TOOLKIT ]]</a>' +
        '<a href="index.html#about">[[ ABOUT ]]</a>';
      d.body.appendChild(side);
    }

    var overlay = d.getElementById("overlay");
    if (!overlay) {
      overlay = d.createElement("div");
      overlay.className = "overlay";
      overlay.id = "overlay";
      d.body.appendChild(overlay);
    }

    var burger = d.createElement("button");
    burger.type = "button";
    burger.className = "hamburger";
    burger.id = "hamburger";
    burger.setAttribute("aria-label", "Open menu");
    burger.innerHTML = "<span></span><span></span><span></span>";
    header.appendChild(burger);

    function close() {
      side.classList.remove("active");
      overlay.classList.remove("active");
      d.body.classList.remove("menu-open");
    }
    burger.addEventListener("click", function (e) {
      e.preventDefault();
      side.classList.toggle("active");
      overlay.classList.toggle("active");
      d.body.classList.toggle("menu-open", side.classList.contains("active"));
    });
    overlay.addEventListener("click", close);
    Array.prototype.forEach.call(side.querySelectorAll("a"), function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ----------------------------------------------------------- theme toggle */
  function ensureTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved === "dark") { d.body.classList.add("dark-mode"); }

    var existing = d.getElementById("theme-toggle");
    if (existing) { return; } /* page handles its own toggle */

    var header = d.querySelector("header");
    if (!header) { return; }
    var nav = header.querySelector("nav") || header;
    var btn = d.createElement("button");
    btn.type = "button";
    btn.id = "theme-toggle";
    btn.className = "theme-toggle";
    btn.innerHTML = "\uD83C\uDF13 Theme";
    nav.appendChild(btn);
    btn.addEventListener("click", function () {
      d.body.classList.toggle("dark-mode");
      try {
        localStorage.setItem("theme", d.body.classList.contains("dark-mode") ? "dark" : "light");
      } catch (e) {}
    });
  }

  /* --------------------------------------------- progress bar + back-to-top */
  function ensureChrome() {
    var bar = d.getElementById("reading-progress");
    if (!bar) {
      bar = d.createElement("div");
      bar.id = "reading-progress";
      d.body.insertBefore(bar, d.body.firstChild);
    }

    var top = d.getElementById("scrollToTop");
    if (!top) {
      top = d.createElement("button");
      top.type = "button";
      top.id = "scrollToTop";
      top.setAttribute("aria-label", "Back to top");
      top.innerHTML = "&#8593;";
      d.body.appendChild(top);
    }

    if (top.dataset.topBound) { return; }
    top.dataset.topBound = "1";

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        var st = window.pageYOffset || d.documentElement.scrollTop || 0;
        var h = d.documentElement.scrollHeight - d.documentElement.clientHeight;
        bar.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
        top.classList.toggle("show", st > 300);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------- active nav link */
  function markActive() {
    var here = location.pathname.split("/").pop() || "index.html";
    Array.prototype.forEach.call(d.querySelectorAll("nav a, .side-nav a"), function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0].split("/").pop();
      if (href && href === here) { a.classList.add("is-active"); }
    });
  }

  ready(function () {
    enhanceCode();
    ensureMenu();
    ensureTheme();
    ensureChrome();
    markActive();
  });
})();

/* ==========================================================================
   Termux Hub — Google Analytics 4 (GA4)
   --------------------------------------------------------------------------
   SETUP: paste your GA4 Measurement ID between the quotes below.
   Where to get it: analytics.google.com > Admin > Data streams > (your web
   stream) > "Measurement ID". It looks like G-XXXXXXXXXX.

   While the ID is empty, analytics stays completely off: no script is
   downloaded, no data is sent, no console errors.

   SECURITY: a GA4 Measurement ID is public by design (it is visible in the
   page source of every site that uses GA4) — it is NOT a secret. Never put a
   Measurement Protocol API secret, a service-account key or any other
   credential in this file, because everything here is public.
   ========================================================================== */
(function () {
  "use strict";

  var GA_ID = "";                                   /* <-- paste G-XXXXXXXXXX here */

  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID)) { return; }   /* not configured yet  */
  if (location.protocol === "file:") { return; }     /* Android app bundle  */
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { return; }

  var d = document, w = window;

  var s = d.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  d.head.appendChild(s);

  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { send_page_view: true });

  var page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");

  function track(name, params) {
    try {
      var p = params || {};
      p.page_name = page;
      w.gtag("event", name, p);
    } catch (e) { /* analytics must never break the page */ }
  }

  d.addEventListener("click", function (e) {
    var el = e.target;
    if (!el || !el.closest) { return; }
    if (el.closest(".copy-label")) { track("copy_command"); }
    if (el.closest("#theme-toggle")) {
      track("theme_toggle", { theme: d.body.classList.contains("dark-mode") ? "dark" : "light" });
    }
    var a = el.closest("a");
    if (a && a.hostname && a.hostname !== location.hostname) {
      track("outbound_click", { link_domain: a.hostname, link_url: a.href });
    }
  }, true);

  var deepRead = false;
  w.addEventListener("scroll", function () {
    if (deepRead) { return; }
    var h = d.documentElement;
    if ((h.scrollTop + w.innerHeight) / h.scrollHeight > 0.9) {
      deepRead = true;
      track("read_90");
    }
  }, { passive: true });

  w.addEventListener("appinstalled", function () { track("pwa_install"); });
})();
