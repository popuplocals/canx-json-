
/* ═══════════════════════════════════════════════════════════════
   blog-loader.js — Fetches posts for the current category from
   WP REST API and renders them into:
     • .blog-grid  (Latest Articles cards, paginated)
     • .num-list   (Most Read numbered rows — always page 1)
     • sidebar popular posts div
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── WP tag IDs for each category slug ── */
  var TAG = {
    'express-entry':              42,
    'family-sponsorship':         44,
    'lmia':                       45,
    'work-permit':                46,
    'super-visa-visitor-visa':    47,
    'provincial-nominee-program': 48,
    'study-permit':               49,
    'citizenship-settlement':     50,
    'refusals-reapplications':    51,
    'immigration-ai':             43,
    'canada':                     52
  };

  /* ── Chip CSS variable + label for each category ── */
  var META = {
    'express-entry':              { color: '--ce',  label: 'EXPRESS ENTRY' },
    'family-sponsorship':         { color: '--cf',  label: 'FAMILY SPONSORSHIP' },
    'lmia':                       { color: '--cl',  label: 'LMIA' },
    'work-permit':                { color: '--cw',  label: 'WORK PERMIT' },
    'super-visa-visitor-visa':    { color: '--cs',  label: 'SUPER VISA' },
    'provincial-nominee-program': { color: '--cp',  label: 'PNP' },
    'study-permit':               { color: '--cst', label: 'STUDY PERMIT' },
    'citizenship-settlement':     { color: '--cc',  label: 'CITIZENSHIP' },
    'refusals-reapplications':    { color: '--cr',  label: 'REFUSALS' },
    'immigration-ai':             { color: '--ca',  label: 'IMMIGRATION &amp; AI' },
    'canada':                     { color: '--cn',  label: 'CANADA' }
  };

  /* Estimated read times (mins) for sidebar items 1-4 */
  var READ_TIMES = [7, 6, 5, 8];

  /* ── Pagination state ── */
  var currentPage = 1;
  var totalPages  = 1;

  /* ── Detect current category from the active pill ── */
  function getCat() {
    var pill = document.querySelector('.h-pill.on');
    if (!pill) return null;
    var href = pill.getAttribute('href') || '';
    var m = href.match(/immigration-blogs\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  /* ── Extract best thumbnail URL from WP post ── */
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

  /* ── Pad number ── */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ── Strip HTML tags (for title safety) ── */
  function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }

  /* ── Build a .blog-card element string ── */
  function buildCard(post, color, label) {
    var img = thumb(post);
    var title = stripTags(post.title.rendered || '');
    return '<a href="' + post.link + '" class="blog-card">'
      + '<div class="card-img"><img decoding="async" src="' + img + '" alt="" loading="lazy"></div>'
      + '<div class="card-body">'
      + '<p class="card-title">' + title + '</p>'
      + '<div class="card-footer">'
      + '<span class="card-chip" style="--c:var(' + color + ');">' + label + '</span>'
      + '<span class="card-read">Read &rarr;</span>'
      + '</div></div></a>';
  }

  /* ── Build a .num-row element string (full title, no truncation) ── */
  function buildNumRow(post, idx, color, label) {
    var img   = thumb(post);
    var title = stripTags(post.title.rendered || '');
    return '<a href="' + post.link + '" class="num-row">'
      + '<span class="num-n">' + pad(idx + 1) + '</span>'
      + '<div class="num-thumb"><img decoding="async" src="' + img + '" alt="" loading="lazy"></div>'
      + '<div class="num-body">'
      + '<span class="num-chip" style="--c:var(' + color + ');">' + label + '</span>'
      + '<p class="num-title">' + title + '</p>'
      + '</div></a>';
  }

  /* ── Build a .sb-post element string ── */
  function buildSbPost(post, idx) {
    var title = stripTags(post.title.rendered || '');
    return '<a href="' + post.link + '" class="sb-post">'
      + '<span class="sb-num">' + pad(idx + 1) + '</span>'
      + '<div><p class="sb-post-title">' + title + '</p></div></a>';
  }

  /* ── Render pagination UI ── */
  function renderPagination(current, total) {
    var pg = document.querySelector('.pagination');
    if (!pg) return;

    var html = '';

    /* Prev arrow */
    if (current > 1) {
      html += '<div  class="pg arrow" data-page="' + (current - 1) + '">&#8249;</div>';
    } else {
      html += '<div  class="pg arrow disabled">&#8249;</div>';
    }

    /* Page numbers — show at most 5 around current */
    var start = Math.max(1, current - 2);
    var end   = Math.min(total, current + 2);
    if (start > 1) html += '<div  class="pg" data-page="1">1</div>' + (start > 2 ? '<div  class="pg dots">…</div>' : '');
    for (var i = start; i <= end; i++) {
      html += '<div  class="pg' + (i === current ? ' on' : '') + '" data-page="' + i + '">' + i + '</div>';
    }
    if (end < total) html += (end < total - 1 ? '<div  class="pg dots">…</div>' : '') + '<div  class="pg" data-page="' + total + '">' + total + '</div>';

    /* Next arrow */
    if (current < total) {
      html += '<div  class="pg arrow" data-page="' + (current + 1) + '">&#8250;</div>';
    } else {
      html += '<div  class="pg arrow disabled">&#8250;</div>';
    }

    pg.innerHTML = html;

    /* Click handlers */
    pg.querySelectorAll('.pg[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newPage = parseInt(this.getAttribute('data-page'), 10);
        if (isNaN(newPage) || newPage < 1 || newPage > totalPages || newPage === currentPage) return;
        currentPage = newPage;
        loadPage(newPage);
        /* Scroll to top of grid */
        var grid = document.querySelector('.blog-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Render the grid only (called on page change) ── */
  function renderGrid(posts, cat) {
    var m = META[cat];
    var color = m.color, label = m.label;
    var grid = document.querySelector('.blog-grid');
    if (grid) {
      grid.innerHTML = posts.map(function (p) {
        return buildCard(p, color, label);
      }).join('');
    }
  }

  /* ── Full first render (grid + num-list + sidebar) ── */
  function renderAll(posts, cat) {
    var m = META[cat];
    var color = m.color, label = m.label;

    /* Latest Articles grid */
    var grid = document.querySelector('.blog-grid');
    if (grid) {
      grid.innerHTML = posts.map(function (p) {
        return buildCard(p, color, label);
      }).join('');
    }

    /* Most Read numbered list — top 5 */
    var numList = document.querySelector('.num-list');
    if (numList) {
      numList.innerHTML = posts.slice(0, 5).map(function (p, i) {
        return buildNumRow(p, i, color, label);
      }).join('');
    }

    /* Sidebar "Popular in …" box — top 4 */
    var sbBoxes = document.querySelectorAll('.sb-box');
    for (var i = 0; i < sbBoxes.length; i++) {
      var lbl = sbBoxes[i].querySelector('.sb-label');
      if (lbl && lbl.textContent.indexOf('Popular') !== -1) {
        var inner = sbBoxes[i].querySelector('div');
        if (inner) {
          inner.innerHTML = posts.slice(0, 4).map(function (p, j) {
            return buildSbPost(p, j);
          }).join('');
        }
        break;
      }
    }
  }

  /* ── Fetch a specific page from WP REST API ── */
  function fetchPage(cat, page) {
    var url = 'https://canxglobal.com/wp-json/wp/v2/posts'
      + '?tags=' + TAG[cat]
      + '&per_page=6&orderby=date&order=desc'
      + '&page=' + page
      + '&_embed=wp:featuredmedia';

    return fetch(url).then(function (r) {
      var tp = parseInt(r.headers.get('X-WP-TotalPages') || '1', 10);
      totalPages = isNaN(tp) ? 1 : tp;
      return r.json();
    });
  }

  /* ── Load a page (grid + pagination only) ── */
  function loadPage(page) {
    var cat = getCat();
    if (!cat || !TAG[cat]) return;
    fetchPage(cat, page)
      .then(function (posts) {
        if (Array.isArray(posts) && posts.length) {
          renderGrid(posts, cat);
          renderPagination(page, totalPages);
        }
      })
      .catch(function (e) { console.warn('[blog-loader] page error', e); });
  }

  /* ── Initial boot ── */
  function load() {
    var cat = getCat();
    if (!cat || !TAG[cat]) return;

    fetchPage(cat, 1)
      .then(function (posts) {
        if (Array.isArray(posts) && posts.length) {
          renderAll(posts, cat);
          renderPagination(1, totalPages);
        }
      })
      .catch(function (e) { console.warn('[blog-loader]', e); });
  }

  /* ── Boot after DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();

