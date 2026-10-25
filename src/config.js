/* Zungu Hotel — central configuration for contact details and Ask Zungu Hotel messages.
   Customer-facing strings live here so a Swahili set can be added later under `strings.sw`
   once approved translations exist. Nothing here is a booking engine: every action opens a
   WhatsApp conversation, and the hotel confirms availability itself. */
window.ZUNGU = (function () {
  var HOTEL = {
    name: 'Zungu Hotel',
    whatsapp: '255766003050',
    phone: '+255766003050',
    phoneDisplay: '+255 766 003 050',
    maps: 'https://maps.app.goo.gl/AhsCizjzyFCqkFHN9',
    instagram: 'https://www.instagram.com/zungu.hotel/'
  };

  var GREETING = 'Hello Zungu Hotel 👋';

  /* form: 'stay' actions open the guided details step; the rest go straight to WhatsApp.
     required: fields the guest must fill before the message can be sent. */
  var strings = {
    en: {
      actions: [
        { id: 'availability', event: 'whatsapp_availability', tag: 'WEB-AVAILABILITY', form: 'stay',
          required: ['name', 'checkin', 'checkout'],
          label: 'Check Availability', hint: 'Dates, guests and rooms', title: 'Check availability',
          intro: "I'd like to check room availability." },
        { id: 'rooms', event: 'whatsapp_rooms', tag: 'WEB-ROOMS', form: 'stay', required: [],
          label: 'Ask About Rooms', hint: 'Room types and what suits you', title: 'Ask about rooms',
          intro: "I'd like more information about your rooms." },
        { id: 'price', event: 'whatsapp_price', tag: 'WEB-PRICE', form: 'stay', required: [],
          label: 'Ask About Prices', hint: 'Current room rates', title: 'Ask about prices',
          intro: "I'd like to ask about your current room rates." },
        { id: 'food', event: 'whatsapp_food', tag: 'WEB-FOOD',
          label: 'Food & Drinks', hint: 'Menu, bar and opening hours',
          lines: ["I'd like to ask about food and drinks at Zungu Hotel."] },
        { id: 'directions', event: 'whatsapp_directions', tag: 'WEB-DIRECTIONS',
          label: 'Get Directions', hint: 'Help finding us in Goba',
          lines: ["I'm planning to visit Zungu Hotel in Goba.", 'Could you help me with directions?'] },
        { id: 'reception', event: 'whatsapp_reception', tag: 'WEB-RECEPTION',
          label: 'Contact Reception', hint: 'Speak with the hotel team',
          lines: ["I'd like to speak with reception."] },
        { id: 'general', event: 'whatsapp_general', tag: 'WEB-CONCIERGE',
          label: 'Something Else', hint: 'Any other question',
          lines: ['I have a question about the hotel.', '', 'Question:'] }
      ]
    }
  };
  var lang = 'en';

  function byId(id) {
    var list = strings[lang].actions;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function nights(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);
  }

  /* v: { name, checkin, checkout, guests, rooms, notes } — all optional */
  function lines(action, v) {
    if (!action.form) return action.lines;
    v = v || {};
    var out = [action.intro, ''];
    var n = v.checkin && v.checkout ? nights(v.checkin, v.checkout) : 0;
    out.push('Name: ' + (v.name || ''));
    out.push('Check-in: ' + (v.checkin ? fmtDate(v.checkin) : ''));
    out.push('Check-out: ' + (v.checkout ? fmtDate(v.checkout) : '') + (n > 0 ? ' (' + n + (n === 1 ? ' night)' : ' nights)') : ''));
    out.push('Guests: ' + (v.guests || ''));
    if (v.rooms) out.push('Rooms: ' + v.rooms);
    if (v.notes) out.push('Notes: ' + v.notes);
    return out;
  }

  function message(action, v) {
    return [GREETING].concat(lines(action, v), ['', '[' + action.tag + ']']).join('\n');
  }

  function whatsappUrl(id, v) {
    var action = byId(id);
    var base = 'https://wa.me/' + HOTEL.whatsapp;
    return action ? base + '?text=' + encodeURIComponent(message(action, v)) : base;
  }

  return { HOTEL: HOTEL, actions: function () { return strings[lang].actions; }, action: byId, nights: nights, whatsappUrl: whatsappUrl };
})();
