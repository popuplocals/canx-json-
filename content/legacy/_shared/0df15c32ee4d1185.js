 
// Custom overrides without breaking Elementor globally
(function() { 
  var fix = document.createElement('style'); 
  fix.textContent = '.cxg-anuj-bio .exp-card:hover .exp-icon{background:#fff!important;color:var(--primary)!important;box-shadow:0 8px 20px rgba(7,104,181,0.16),inset 0 0 0 1px rgba(7,104,181,0.12)!important}'; 
  document.head.appendChild(fix); 
})(); 

// gentle scroll reveal - FIXED FOR MOBILE
const obs = new IntersectionObserver((entries) => { 
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('in'); 
      obs.unobserve(e.target); 
    } 
  }); 
}, { 
  threshold: 0, 
  rootMargin: '100px' // Fix for mobile viewport bugs
}); 
document.querySelectorAll('.reveal').forEach(el => obs.observe(el)); 

// Mobile Fallback: Force reveal after 500ms to prevent invisible page bug
setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}, 500);
