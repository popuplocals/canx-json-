
/* ═══════════════════════════════════════════════════════════════
   home-loader.js — Dynamically fetches latest posts from WP REST
   API and renders them into every section on the main index page
   (/immigration-blogs/). Runs only when the "All" pill is active.
   Chips use .card-chip / .num-chip with inline --c:var(--cx) style,
   identical to blog-loader.js on category pages.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Only run on the main "All" index page ── */
  var activePill = document.querySelector('.h-pill.on');
  if (!activePill || activePill.textContent.trim() !== 'All') return;

  var BASE  = 'https://canxglobal.com/wp-json/wp/v2/posts';
  var EMBED = '&_embed=wp:featuredmedia';

  /* ── Category definitions: WP tag ID, CSS var name, display label ── */
  var CATS = {
    'express-entry':              { tag: 42, color: '--ce',  label: 'EXPRESS ENTRY' },
    'family-sponsorship':         { tag: 44, color: '--cf',  label: 'FAMILY SPONSORSHIP' },
    'lmia':                       { tag: 45, color: '--cl',  label: 'LMIA' },
    'work-permit':                { tag: 46, color: '--cw',  label: 'WORK PERMIT' },
    'super-visa-visitor-visa':    { tag: 47, color: '--cs',  label: 'SUPER VISA' },
    'provincial-nominee-program': { tag: 48, color: '--cp',  label: 'PNP' },
    'study-permit':               { tag: 49, color: '--cst', label: 'STUDY PERMIT' },
    'citizenship-settlement':     { tag: 50, color: '--cc',  label: 'CITIZENSHIP' },
    'refusals-reapplications':    { tag: 51, color: '--cr',  label: 'REFUSALS' },
    'immigration-ai':             { tag: 43, color: '--ca',  label: 'IMMIGRATION &amp; AI' },
    'canada':                     { tag: 52, color: '--cn',  label: 'CANADA' }
  };

  /* ── Tag ID → slug reverse map ── */
  var TAG_TO_SLUG = {};
  Object.keys(CATS).forEach(function (s) { TAG_TO_SLUG[CATS[s].tag] = s; });

  /* ── Helpers ── */
  function thumb(post) {
    try {
      var fm = post._embedded['wp:featuredmedia'][0];
      var sizes = fm.media_details && fm.media_details.sizes;
      if (sizes) {
        var s = sizes.medium_large || sizes.large || sizes.medium || sizes.thumbnail;
        if (s && s.source_url) return s.source_url;
      }
      return fm.source_url || '';
    } catch (e) { return ''; }
  }
  function strip(s) { return s.replace(/<[^>]+>/g, ''); }
  function trunc(s, n) { return s.length > n ? s.substring(0, n) + '…' : s; }
  function pad(n)   { return n < 10 ? '0' + n : '' + n; }

  function catFromPost(post) {
    var tags = post.tags || [];
    for (var i = 0; i < tags.length; i++) {
      var slug = TAG_TO_SLUG[tags[i]];
      if (slug) return CATS[slug];
    }
    return CATS['express-entry'];
  }

  /* chip helper — same inline style as blog-loader.js */
  function cardChip(cat) {
    return '<span class="card-chip" style="--c:var(' + cat.color + ');">' + cat.label + '</span>';
  }
  function numChip(cat) {
    return '<span class="num-chip" style="--c:var(' + cat.color + ');">' + cat.label + '</span>';
  }

  /* ── HTML builders ── */

  /* Post card (.pc) — grid sections */
  function buildPc(post, cat) {
    var img   = thumb(post);
    var title = strip(post.title.rendered || '');
    return '<a href="' + post.link + '" class="pc">'
      + '<div class="pct"><img decoding="async" src="' + img + '" alt="" loading="lazy"></div>'
      + '<div  class="pcb"><h3>' + title + '</h3>'
      + '<div class="pcm">' + cardChip(cat) + '<span class="rd">Read &rarr;</span></div>'
      + '</div></a>';
  }

  /* Numbered list row (.nl-row) — compact sections */
  function buildNlRow(post, idx, cat) {
    var img   = thumb(post);
    var title = strip(post.title.rendered || '');
    return '<a href="' + post.link + '" class="nl-row">'
      + '<span class="nl-n">' + pad(idx + 1) + '</span>'
      + '<div class="nl-img"><img decoding="async" src="' + img + '" alt="" loading="lazy"></div>'
      + '<div class="nl-b">' + numChip(cat) + '<h4>' + title + '</h4></div></a>';
  }

  /* Trending row (.tr-row) */
  function buildTrRow(post, idx, cat) {
    var img   = thumb(post);
    var title = strip(post.title.rendered || '');
    return '<a href="' + post.link + '" class="tr-row">'
      + '<div class="tr-n">' + pad(idx + 1) + '</div>'
      + '<div class="tr-img"><img decoding="async" src="' + img + '" alt="" loading="lazy"></div>'
      + '<div class="tr-b"><div class="tr-title">' + title + '</div>'
      + '<div>' + cardChip(cat) + '</div></div></a>';
  }

  /* Hero mosaic pane (.e-pane) */
  function buildEPane(post, cat, isMain) {
    var img   = thumb(post);
    var title = strip(post.title.rendered || '');
    return '<a href="' + post.link + '" class="e-pane">'
      + '<img decoding="async" src="' + img + '" alt="" loading="lazy">'
      + '<div class="e-grad"></div>'
      + '<div class="e-body">' + cardChip(cat)
      + (isMain ? '<h2>' + title + '</h2>' : '<h3>' + title + '</h3>')
      + '</div></a>';
  }

  /* ── Renderers ── */

  function renderMosaic(posts) {
    if (posts.length < 3) return;
    var mosaic = document.querySelector('.e-mosaic');
    if (!mosaic) return;
    mosaic.innerHTML =
        buildEPane(posts[0], catFromPost(posts[0]), true)
      + '<div class="e-side-col">'
      + buildEPane(posts[1], catFromPost(posts[1]), false)
      + buildEPane(posts[2], catFromPost(posts[2]), false)
      + '</div>';
  }

  function renderTrending(posts) {
    var tl = document.querySelector('.tr-list');
    if (!tl) return;
    tl.innerHTML = posts.slice(0, 5).map(function (p, i) {
      return buildTrRow(p, i, catFromPost(p));
    }).join('');
  }

  function findSection(slug) {
    var sa = document.querySelector('a.sa[href*="immigration-blogs/' + slug + '"]');
    if (!sa) return null;
    var el = sa;
    while (el && el !== document.body) {
      if (el.tagName === 'SECTION' || el.classList.contains('off-sec') ||
          el.classList.contains('light-sec') || el.classList.contains('accent-sec') ||
          el.classList.contains('blue-tint')) return el;
      el = el.parentElement;
    }
    return null;
  }

  function renderCat(slug, posts) {
    if (!posts.length) return;
    var section = findSection(slug);
    if (!section) return;
    var cat = CATS[slug];

    /* Grid layout */
    var g5 = section.querySelector('.g5');
    if (g5) {
      g5.innerHTML = posts.slice(0, 5).map(function (p) { return buildPc(p, cat); }).join('');
      return;
    }

    /* Numbered-list layout */
    var wrap = section.querySelector('.wrap');
    if (!wrap) return;
    Array.from(wrap.querySelectorAll('.nl-row')).forEach(function (r) { r.remove(); });
    wrap.insertAdjacentHTML('beforeend',
      posts.slice(0, 5).map(function (p, i) { return buildNlRow(p, i, cat); }).join(''));
  }

  /* ── Fetch helpers ── */

  function fetchLatest() {
    return fetch(BASE + '?per_page=30&orderby=date&order=desc' + EMBED)
      .then(function (r) { return r.json(); })
      .then(function (d) { return Array.isArray(d) ? d : []; })
      .catch(function () { return []; });
  }

  /* Re-order posts so distinct categories come first (one per category in
     recency order), then the remainder — gives the hero/trending variety
     instead of showing several posts from the same tag. */
  function diversify(posts) {
    var seen = {}, head = [], tail = [];
    posts.forEach(function (p) {
      var key = catFromPost(p).label;
      if (!seen[key]) { seen[key] = 1; head.push(p); }
      else { tail.push(p); }
    });
    return head.concat(tail);
  }

  function fetchByTag(slug) {
    return fetch(BASE + '?tags=' + CATS[slug].tag + '&per_page=5&orderby=date&order=desc' + EMBED)
      .then(function (r) { return r.json(); })
      .then(function (d) { return Array.isArray(d) ? d : []; })
      .catch(function () { return []; });
  }

  /* ── Boot ── */
  function load() {
    var slugs = Object.keys(CATS);
    Promise.all(slugs.map(function (s) {
      return fetchByTag(s).then(function (posts) { return { slug: s, posts: posts }; });
    })).then(function (results) {
      /* render each category section */
      results.forEach(function (r) { renderCat(r.slug, r.posts); });
      /* hero = latest post from each DIFFERENT category, newest category first */
      var reps = results.filter(function (r) { return r.posts.length; })
                        .map(function (r) { return r.posts[0]; })
                        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      renderMosaic(reps.slice(0, 3));
      renderTrending(reps.length >= 8 ? reps.slice(3, 8) : reps.slice(0, 5));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();

