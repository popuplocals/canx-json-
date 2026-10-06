

  function init() {
    /* Inject markup at top of body */
    document.body.insertAdjacentHTML('afterbegin', HEADER_HTML);

    var hdr = document.getElementById('cxgHdr');
    var ham = document.getElementById('cxgHam');
    var mob = document.getElementById('cxgMob');
    var overlay = document.getElementById('mobOverlay');
    var mobClose = document.getElementById('mobClose');

    /* Scroll shrink */
    if (hdr) {
      window.addEventListener('scroll', function(){
        hdr.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    /* Mobile open/close */
    function openMob(){ if(!mob) return; mob.classList.add('open'); ham&&ham.classList.add('open'); overlay&&overlay.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeMob(){ if(!mob) return; mob.classList.remove('open'); ham&&ham.classList.remove('open'); overlay&&overlay.classList.remove('open'); document.body.style.overflow=''; }
    if (ham) ham.addEventListener('click', function(e){ e.stopPropagation(); mob && mob.classList.contains('open') ? closeMob() : openMob(); });
    if (overlay) overlay.addEventListener('click', closeMob);
    if (mobClose) mobClose.addEventListener('click', closeMob);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && mob && mob.classList.contains('open')) closeMob(); });

    /* Mobile accordion */
    if (mob) {
      mob.querySelectorAll('.mob-li').forEach(function(li){
        var row = li.querySelector('.mob-row');
        if (!row) return;
        row.addEventListener('click', function(){
          var wasOpen = li.classList.contains('open');
          mob.querySelectorAll('.mob-li').forEach(function(x){ x.classList.remove('open'); });
          if (!wasOpen) li.classList.add('open');
        });
      });
      mob.querySelectorAll('.mob-sub-li').forEach(function(li){
        var row = li.querySelector('.mob-sub-row');
        if (!row) return;
        row.addEventListener('click', function(){
          var wasOpen = li.classList.contains('open');
          var parent = li.closest('.mob-sub-ul');
          if (parent) parent.querySelectorAll('.mob-sub-li').forEach(function(x){ x.classList.remove('open'); });
          if (!wasOpen) li.classList.add('open');
        });
      });
    }

    /* Desktop mega menu hover */
    var allNi = document.querySelectorAll('.cxg-ni');
    function closeAllMega(){ allNi.forEach(function(n){ var m=n.querySelector('.cxg-mega'); if(m) m.classList.remove('mega-open'); }); }
    allNi.forEach(function(ni){
      var mega = ni.querySelector('.cxg-mega');
      if (!mega) return;
      var t;
      function open(){ clearTimeout(t); closeAllMega(); mega.classList.add('mega-open'); }
      function close(){ t = setTimeout(function(){ mega.classList.remove('mega-open'); }, 160); }
      ni.addEventListener('mouseenter', open);
      ni.addEventListener('mouseleave', close);
      mega.addEventListener('mouseenter', open);
      mega.addEventListener('mouseleave', close);
    });

    /* Career hover expand */
    var careerTrigger = document.getElementById('careerTrigger');
    var careerCol = document.getElementById('careerCol');
    var careerTimer;
    if (careerTrigger && careerCol) {
      function openCareer(){ clearTimeout(careerTimer); careerTrigger.classList.add('career-active'); careerCol.classList.add('career-open'); }
      function closeCareer(){ careerTimer = setTimeout(function(){ careerTrigger.classList.remove('career-active'); careerCol.classList.remove('career-open'); }, 150); }
      careerTrigger.addEventListener('mouseenter', openCareer);
      careerTrigger.addEventListener('mouseleave', closeCareer);
      careerCol.addEventListener('mouseenter', openCareer);
      careerCol.addEventListener('mouseleave', closeCareer);
    }

    /* Immigration sidebar tabs */
    var immTabs = document.querySelectorAll('.imm-tab[data-panel]');
    var immPanels = document.querySelectorAll('.imm-panel');
    immTabs.forEach(function(tab){
      tab.addEventListener('mouseenter', function(){
        immTabs.forEach(function(t){ t.classList.remove('imm-active'); });
        immPanels.forEach(function(p){ p.classList.remove('imm-active'); });
        tab.classList.add('imm-active');
        var panel = document.getElementById(tab.dataset.panel);
        if (panel) panel.classList.add('imm-active');
      });
    });

    /* Family sponsorship sub-tabs */
    var immSubTabs = document.querySelectorAll('.imm-subtab');
    var immSubPanels = document.querySelectorAll('.imm-subpanel');
    immSubTabs.forEach(function(tab){
      tab.addEventListener('mouseenter', function(){
        immSubTabs.forEach(function(t){ t.classList.remove('imm-sub-active'); });
        immSubPanels.forEach(function(p){ p.classList.remove('imm-sub-active'); });
        tab.classList.add('imm-sub-active');
        var panel = document.getElementById(tab.dataset.sub);
        if (panel) panel.classList.add('imm-sub-active');
      });
    });

    /* Blog category hover */
    var blogCatLinks = document.querySelectorAll('.blog-cat-link');
    var blogPanels = document.querySelectorAll('.blog-panel');
    blogCatLinks.forEach(function(link){
      link.addEventListener('mouseenter', function(){
        blogCatLinks.forEach(function(l){ l.classList.remove('blog-cat-active'); });
        blogPanels.forEach(function(p){ p.classList.remove('blog-active'); });
        link.classList.add('blog-cat-active');
        var panel = document.getElementById(link.dataset.blog);
        if (panel) panel.classList.add('blog-active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
