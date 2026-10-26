/* Navigation and gallery. Concierge loads independently as native modules. */
(function () {
'use strict';
var $ = function(s,r){return (r||document).querySelector(s);};
var $$ = function(s,r){return Array.from((r||document).querySelectorAll(s));};
  /* ---- Mobile navigation drawer ---- */
  var toggle = $('.nav-toggle'), drawer = $('#nav-drawer');
  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('open', open);
    if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
    document.body.classList.toggle('scroll-locked', open);
  }
  if (toggle && drawer) {
    setDrawer(false);
    toggle.addEventListener('click', function () { setDrawer(toggle.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a, button')) setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) { setDrawer(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });
  }

  /* ---- Gallery lightbox ---- */
  var box = $('#lightbox');
  if (box && typeof box.showModal === 'function') {
    var img = $('img', box), cap = $('p', box);
    $$('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        img.src = btn.getAttribute('data-full');
        img.alt = cap.textContent = btn.getAttribute('data-alt') || '';
        box.showModal();
        document.body.classList.add('scroll-locked');
      });
    });
    $('button', box).addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('close', function () { document.body.classList.remove('scroll-locked'); img.removeAttribute('src'); });
  }
})();
