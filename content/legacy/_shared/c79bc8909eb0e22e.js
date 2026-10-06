
/* ════════════════════════════════════════════
   pills.js — two helpers:
   1. Rewrite canxglobal.com immigration-blogs
      URLs to local files (local preview only).
   2. Inject ‹ › arrow buttons inside every
      .hero-pills-wrap for mobile scroll nav
      (CSS shows them only on ≤768px).
   ════════════════════════════════════════════ */
(function(){

  /* ── 1. URL rewriter (local preview) ────── */
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';

  var MAP = {
    'immigration-blogs/': 'index.html',
    'immigration-blogs/express-entry/': 'express-entry.html',
    'immigration-blogs/family-sponsorship/': 'family-sponsorship.html',
    'immigration-blogs/lmia/': 'lmia.html',
    'immigration-blogs/work-permit/': 'work-permit.html',
    'immigration-blogs/super-visa-visitor-visa/': 'super-visa.html',
    'immigration-blogs/provincial-nominee-program/': 'pnp.html',
    'immigration-blogs/study-permit/': 'study-permit.html',
    'immigration-blogs/citizenship-settlement/': 'citizenship.html',
    'immigration-blogs/refusals-reapplications/': 'refusals.html',
    'immigration-blogs/immigration-ai/': 'immigration-ai.html',
    'immigration-blogs/canada/': 'canada.html'
  };

  function rewrite(){
    if (!isLocal) return;
    var links = document.querySelectorAll('a[href*="canxglobal.com"]');
    links.forEach(function(a){
      var href = a.getAttribute('href');
      var path = href.replace(/^https?:\/\/(www\.)?canxglobal\.com\//, '');
      if (MAP[path]) a.setAttribute('href', MAP[path]);
    });
  }

  /* ── 2. Mobile arrow buttons ─────────────
     Inject <button class="h-arrow-btn h-prev"> and
     <button class="h-arrow-btn h-next"> into every
     .hero-pills-wrap so CSS can show them on mobile.
  ─────────────────────────────────────────── */
  function injectArrows(){
    var wraps = document.querySelectorAll('.hero-pills-wrap');
    wraps.forEach(function(wrap){
      var pills = wrap.querySelector('.hero-pills');
      if (!pills) return;

      var prev = document.createElement('button');
      prev.className = 'h-arrow-btn h-prev';
      prev.innerHTML = '&#8249;'; /* ‹ */
      prev.setAttribute('aria-label', 'Scroll left');

      var next = document.createElement('button');
      next.className = 'h-arrow-btn h-next';
      next.innerHTML = '&#8250;'; /* › */
      next.setAttribute('aria-label', 'Scroll right');

      wrap.appendChild(prev);
      wrap.appendChild(next);

      var step = 180;
      prev.addEventListener('click', function(){
        pills.scrollBy({left: -step, behavior: 'smooth'});
      });
      next.addEventListener('click', function(){
        pills.scrollBy({left: step, behavior: 'smooth'});
      });
    });
  }

  /* ── Run both after DOM ready ────────── */
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      rewrite();
      injectArrows();
    });
  } else {
    rewrite();
    injectArrows();
  }

})();

