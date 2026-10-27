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
    var img = $('img', box), cap = $('p', box), photos = $$('[data-full]');
    var active = 0, opener = null;
    function showPhoto(index) {
      active = (index + photos.length) % photos.length;
      var photo = photos[active];
      img.src = photo.getAttribute('data-full');
      img.alt = photo.getAttribute('data-alt') || '';
      cap.textContent = (active + 1) + ' / ' + photos.length + ' · ' + img.alt;
    }
    photos.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        opener = btn;
        showPhoto(index);
        box.showModal();
        document.body.classList.add('scroll-locked');
        $('[data-photo-close]', box).focus();
      });
    });
    $('[data-photo-close]', box).addEventListener('click', function () { box.close(); });
    $('[data-photo-prev]', box).addEventListener('click', function () { showPhoto(active - 1); });
    $('[data-photo-next]', box).addEventListener('click', function () { showPhoto(active + 1); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); showPhoto(active + (e.key === 'ArrowRight' ? 1 : -1));
      }
      if (e.key === 'Tab') {
        var controls = $$('button', box), first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    box.addEventListener('click', function (e) {
      var r = box.getBoundingClientRect();
      if (e.target === box && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) box.close();
    });
    box.addEventListener('close', function () {
      document.body.classList.remove('scroll-locked'); img.removeAttribute('src');
      if (opener && opener.isConnected) opener.focus();
    });
  }
})();
