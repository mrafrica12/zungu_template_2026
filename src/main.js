/* Zungu Hotel — navigation, Ask Zungu Hotel concierge, gallery lightbox, event hooks. */
(function () {
  'use strict';
  var Z = window.ZUNGU;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Analytics hook: forwards to gtag / dataLayer if the site later adds one. */
  function track(name) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name);
      else if (window.dataLayer) window.dataLayer.push({ event: name });
    } catch (e) { /* ignore */ }
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---- Direct WhatsApp links: [data-ask="food"] ---- */
  $$('[data-ask]').forEach(function (a) {
    var id = a.getAttribute('data-ask'), action = Z.action(id);
    a.href = Z.whatsappUrl(id);
    a.target = '_blank';
    a.rel = 'noopener';
    if (action) a.setAttribute('data-track', action.event);
  });

  /* ---- Click tracking ---- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'));
  });

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

  /* ---- Ask section list on the page (form actions open the concierge) ---- */
  $$('[data-page-actions]').forEach(function (ul) {
    ul.textContent = '';
    Z.actions().forEach(function (a, i) {
      var li = document.createElement('li'), el = document.createElement('a');
      el.className = 'quick-action';
      el.href = Z.whatsappUrl(a.id);
      el.target = '_blank';
      el.rel = 'noopener';
      if (a.form) el.setAttribute('data-open-ask', a.id); else el.setAttribute('data-track', a.event);
      el.innerHTML = '<span class="qa-num" aria-hidden="true">0' + (i + 1) + '</span><span class="qa-text"><strong></strong><small></small></span>' + ARROW;
      $('strong', el).textContent = a.label;
      $('small', el).textContent = a.hint;
      li.appendChild(el);
      ul.appendChild(li);
    });
  });

  /* ---- Ask Zungu Hotel concierge: topics -> (optional) stay details -> WhatsApp ---- */
  var dlg = $('#ask-dialog');
  if (dlg && typeof dlg.showModal === 'function') {
    var topics = $('#ask-topics', dlg), form = $('#ask-form', dlg), err = $('#ask-error', dlg);
    var heading = $('#ask-dialog-title', dlg), lead = $('#ask-lead', dlg);
    var current = null;
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    var todayIso = today.toISOString().slice(0, 10);

    /* Topic list built from config */
    var list = $('[data-quick-actions]', dlg);
    Z.actions().forEach(function (a, i) {
      var li = document.createElement('li'), el = document.createElement(a.form ? 'button' : 'a');
      el.className = 'quick-action';
      el.setAttribute('data-topic', a.id);
      if (a.form) el.type = 'button';
      else { el.href = Z.whatsappUrl(a.id); el.target = '_blank'; el.rel = 'noopener'; el.setAttribute('data-track', a.event); }
      el.innerHTML = '<span class="qa-num" aria-hidden="true">0' + (i + 1) + '</span><span class="qa-text"><strong></strong><small></small></span>' + ARROW;
      $('strong', el).textContent = a.label;
      $('small', el).textContent = a.hint;
      li.appendChild(el);
      list.appendChild(li);
    });

    function showTopics() {
      current = null;
      form.hidden = true; topics.hidden = false;
      heading.textContent = 'Karibu 👋';
      lead.textContent = "How can we help? Choose a topic and we'll open WhatsApp with your message ready.";
      var first = $('.quick-action', topics); if (first) first.focus();
    }

    function showForm(id) {
      current = Z.action(id);
      if (!current || !current.form) return;
      topics.hidden = true; form.hidden = false; err.textContent = '';
      heading.textContent = current.title;
      lead.textContent = id === 'availability'
        ? 'Tell us about your stay. We send it to the hotel on WhatsApp and the team replies to confirm.'
        : 'Optional details help the hotel answer faster. Skip anything you prefer to discuss in chat.';
      $('[name=checkin]', form).min = todayIso;
      $('[name=checkout]', form).min = todayIso;
      $('[name=name]', form).focus();
    }

    function open(id) {
      if (!dlg.open) { dlg.showModal(); document.body.classList.add('scroll-locked'); track('ask_zungu_open'); }
      var a = id && Z.action(id);
      if (a && a.form) showForm(id); else showTopics();
    }

    $$('[data-open-ask]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        setDrawer(false);
        open(btn.getAttribute('data-open-ask'));
      });
    });

    topics.addEventListener('click', function (e) {
      var t = e.target.closest('button[data-topic]');
      if (t) showForm(t.getAttribute('data-topic'));
      else if (e.target.closest('a')) dlg.close();
    });
    $('[data-back]', form).addEventListener('click', showTopics);

    /* Steppers */
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]');
      if (!b) return;
      var input = $('[name=' + b.getAttribute('data-for') + ']', form);
      var v = (parseInt(input.value, 10) || 0) + parseInt(b.getAttribute('data-step'), 10);
      input.value = Math.max(parseInt(input.min, 10), Math.min(parseInt(input.max, 10), v));
    });

    /* Keep check-out after check-in */
    $('[name=checkin]', form).addEventListener('change', function () {
      var ci = this.value, co = $('[name=checkout]', form);
      if (!ci) return;
      var next = new Date(ci + 'T00:00:00'); next.setDate(next.getDate() + 1);
      co.min = next.toISOString().slice(0, 10);
      if (!co.value || co.value <= ci) co.value = co.min;
      updateNights();
    });
    $('[name=checkout]', form).addEventListener('change', updateNights);
    function updateNights() {
      var ci = $('[name=checkin]', form).value, co = $('[name=checkout]', form).value, out = $('#ask-nights', form);
      var n = ci && co ? Z.nights(ci, co) : 0;
      out.textContent = n > 0 ? n + (n === 1 ? ' night' : ' nights') : '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, v = {
        name: f.name.value.trim(), checkin: f.checkin.value, checkout: f.checkout.value,
        guests: f.guests.value, rooms: f.rooms.value, notes: f.notes.value.trim()
      };
      var missing = current.required.filter(function (k) { return !v[k]; });
      if (!missing.length && v.checkin && v.checkout && Z.nights(v.checkin, v.checkout) < 1) { missing = ['checkout']; }
      if (missing.length) {
        err.textContent = missing.indexOf('checkout') > -1 && v.checkin && v.checkout
          ? 'Check-out must be after check-in.' : 'Please add your name and your check-in and check-out dates.';
        var bad = $('[name=' + missing[0] + ']', form); if (bad) bad.focus();
        return;
      }
      err.textContent = '';
      track(current.event);
      window.open(Z.whatsappUrl(current.id, v), '_blank', 'noopener');
      dlg.close();
    });

    $('[data-close-ask]', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { document.body.classList.remove('scroll-locked'); });
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
