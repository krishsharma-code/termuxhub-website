/* ==========================================================================
   Termux Hub — tracking.js
   One place for Google Analytics 4 and Google AdSense.

   TO GO LIVE, fill in the two IDs below and commit:

     ga4     -> Google Analytics 4 Measurement ID
                analytics.google.com -> Admin -> Data streams -> your stream
                looks like "G-ABC123XYZ"

     adsense -> Google AdSense Publisher ID
                adsense.com -> Account -> Settings -> Account information
                looks like "ca-pub-1234567890123456"

   While an ID is an empty string, that service is simply not loaded —
   nothing breaks, no requests are made.
   ========================================================================== */
window.TERMUXHUB_TRACKING = {
  ga4: "",      /* e.g. "G-ABC123XYZ" */
  adsense: ""   /* e.g. "ca-pub-1234567890123456" */
};

(function () {
  "use strict";

  var cfg = window.TERMUXHUB_TRACKING || {};

  /* ---------------------------------------------------------- Google Analytics 4 */
  if (cfg.ga4) {
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.ga4);
    document.head.appendChild(ga);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", cfg.ga4, { anonymize_ip: true });
  }

  /* ---------------------------------------------------------------- Google AdSense
     Auto ads: Google decides placement itself once the account is approved. */
  if (cfg.adsense) {
    var ad = document.createElement("script");
    ad.async = true;
    ad.crossOrigin = "anonymous";
    ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
             encodeURIComponent(cfg.adsense);
    document.head.appendChild(ad);
  }
})();
