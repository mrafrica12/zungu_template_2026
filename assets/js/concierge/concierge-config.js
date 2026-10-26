// Shared public-site contact configuration.
export const HOTEL = Object.freeze({
  name: 'Zungu Hotel', location: 'Goba, near Ndambi Bus Stop, Dar es Salaam, Tanzania',
  plusCode: '756R+M7 Dar es Salaam', phone: '+255 766 003 050', localPhone: '0766 003 050',
  whatsapp: '255766003050', maps: 'https://maps.app.goo.gl/AhsCizjzyFCqkFHN9',
  instagram: 'https://www.instagram.com/zungu.hotel/', hasRooms: true, hasBarAndFood: true
});
export const FLAGS = Object.freeze({
  roomTypes: false, // CONFIRM: published room types and names.
  rates: false, // CONFIRM: published rates.
  stayTimes: false, // CONFIRM: check-in and check-out times.
  breakfast: false, // CONFIRM: breakfast availability.
  wifi: false, // CONFIRM: Wi-Fi availability.
  parking: false, // CONFIRM: parking availability.
  transport: false, // CONFIRM: transport arrangements.
  housekeeping: false, // CONFIRM: housekeeping requests.
  roomService: false, // CONFIRM: room service.
  laundry: false, // CONFIRM: laundry service.
  backupPower: false, // CONFIRM: backup power.
  backupWater: false, // CONFIRM: backup water.
  payments: false, // CONFIRM: accepted payment methods.
  staffLanguages: false, // CONFIRM: languages spoken by staff.
  receptionHours: false, // CONFIRM: reception hours.
  guestFood: false, // CONFIRM: during-stay food requests.
  checkoutHelp: false, // CONFIRM: check-out assistance.
  logging: false // Optional Phase 5 only; no logging implementation in Phase 1.
});
export const ZUNGU_TAGS = Object.freeze({
  general:'WEB-CONCIERGE', availability:'WEB-AVAILABILITY', booking:'WEB-BOOKING',
  rates:'WEB-RATES', rooms:'WEB-ROOMS', food:'WEB-FOOD', directions:'WEB-DIRECTIONS',
  transport:'WEB-TRANSPORT', guide:'WEB-GUIDE', manageStay:'STAY-MANAGE',
  changeArrival:'STAY-ARRIVAL-CHANGE', guestService:'GUEST-SERVICE',
  housekeeping:'GUEST-HOUSEKEEPING', problem:'GUEST-ASSISTANCE', checkout:'GUEST-CHECKOUT',
  preArrival:'STAFF-PREARRIVAL', review:'POST-STAY-REVIEW', guideCoffee:'WEB-GUIDE-COFFEE', guideFood:'WEB-GUIDE-FOOD',
  guideNature:'WEB-GUIDE-NATURE', guideMedical:'WEB-GUIDE-MEDICAL', guidePharmacy:'WEB-GUIDE-PHARMACY',
  guideTransport:'WEB-GUIDE-TRANSPORT', guideMoney:'WEB-GUIDE-MONEY', guideGroceries:'WEB-GUIDE-GROCERIES',
  guideShopping:'WEB-GUIDE-SHOPPING', guideFuel:'WEB-GUIDE-FUEL', guideExplore:'WEB-GUIDE-EXPLORE',
  guideSafety:'WEB-GUIDE-SAFETY', guideHelp:'WEB-GUIDE-HELP', guidePlace:'WEB-GUIDE-PLACE', guideSaved:'WEB-GUIDE-SAVED'
});
export const LIMITS = Object.freeze({ guests:10, note:200, message:999 });
export const LANGUAGE_KEY = 'zungu-concierge-language';
// Flags govern UI exposure, not pure template testing. Review is registry-only and must never be sent by this UI.
export const INTENT_FLAGS = Object.freeze({transport:'transport', housekeeping:'housekeeping', checkout:'checkoutHelp'});
export const REGISTRY_ONLY = Object.freeze(['review','preArrival']);

// Journey metadata only: never appended to guest-facing message text.
// VERIFY: all Kiswahili journey labels below require native-speaker review.
export const ZUNGU_JOURNEY = Object.freeze([
  {stage:'discover', label:{en:'Discover',sw:'Gundua'}, source:'website', tags:[]},
  {stage:'ask', label:{en:'Ask',sw:'Uliza'}, source:'guest', tags:[ZUNGU_TAGS.general,ZUNGU_TAGS.rates,ZUNGU_TAGS.rooms,ZUNGU_TAGS.food]},
  {stage:'book', label:{en:'Book',sw:'Hifadhi'}, source:'guest', tags:[ZUNGU_TAGS.availability,ZUNGU_TAGS.booking]},
  {stage:'arrive', label:{en:'Arrive',sw:'Kuwasili'}, source:'guest+staff', tags:[ZUNGU_TAGS.directions,ZUNGU_TAGS.transport,ZUNGU_TAGS.manageStay,ZUNGU_TAGS.changeArrival,ZUNGU_TAGS.preArrival]},
  {stage:'stay', label:{en:'Stay',sw:'Ukaaji'}, source:'guest', tags:[ZUNGU_TAGS.guestService]},
  {stage:'explore', label:{en:'Explore',sw:'Tembea'}, source:'guest', tags:[ZUNGU_TAGS.guide,ZUNGU_TAGS.guideCoffee,ZUNGU_TAGS.guideFood,ZUNGU_TAGS.guideNature,ZUNGU_TAGS.guideMedical,ZUNGU_TAGS.guidePharmacy,ZUNGU_TAGS.guideTransport,ZUNGU_TAGS.guideMoney,ZUNGU_TAGS.guideGroceries,ZUNGU_TAGS.guideShopping,ZUNGU_TAGS.guideFuel,ZUNGU_TAGS.guideExplore,ZUNGU_TAGS.guideSafety,ZUNGU_TAGS.guideHelp,ZUNGU_TAGS.guidePlace,ZUNGU_TAGS.guideSaved]},
  {stage:'request', label:{en:'Request',sw:'Omba'}, source:'guest', tags:[ZUNGU_TAGS.housekeeping,ZUNGU_TAGS.problem]},
  {stage:'checkout', label:{en:'Checkout',sw:'Kuondoka'}, source:'guest', tags:[ZUNGU_TAGS.checkout]},
  {stage:'review', label:{en:'Review',sw:'Maoni'}, source:'staff', tags:[ZUNGU_TAGS.review]}
].map(item=>Object.freeze({...item,label:Object.freeze(item.label),tags:Object.freeze(item.tags)})));

// Existing guide categories and tags; no new places or hotel services.
export const EXPLORE_CATEGORIES = Object.freeze([
  Object.freeze({id:'all',intent:'guideHelp',tag:ZUNGU_TAGS.guideHelp}),
  Object.freeze({id:'coffee',intent:'guideCoffee',tag:ZUNGU_TAGS.guideCoffee}),
  Object.freeze({id:'food',intent:'guideFood',tag:ZUNGU_TAGS.guideFood}),
  Object.freeze({id:'nature',intent:'guideNature',tag:ZUNGU_TAGS.guideNature}),
  Object.freeze({id:'things',intent:'guideExplore',tag:ZUNGU_TAGS.guideExplore}),
  Object.freeze({id:'medical',intent:'guideMedical',tag:ZUNGU_TAGS.guideMedical}),
  Object.freeze({id:'pharmacy',intent:'guidePharmacy',tag:ZUNGU_TAGS.guidePharmacy}),
  Object.freeze({id:'money',intent:'guideMoney',tag:ZUNGU_TAGS.guideMoney}),
  Object.freeze({id:'groceries',intent:'guideGroceries',tag:ZUNGU_TAGS.guideGroceries}),
  Object.freeze({id:'shopping',intent:'guideShopping',tag:ZUNGU_TAGS.guideShopping}),
  Object.freeze({id:'transport',intent:'guideTransport',tag:ZUNGU_TAGS.guideTransport}),
  Object.freeze({id:'fuel',intent:'guideFuel',tag:ZUNGU_TAGS.guideFuel}),
  Object.freeze({id:'safety',intent:'guideSafety',tag:ZUNGU_TAGS.guideSafety})
]);

export const STAFF_REVIEW = Object.freeze({
  enabled: false, // CONFIRM: enable only after the hotel's direct review link is supplied.
  url: '' // CONFIRM: Google Business Profile review link.
});

// Supply a hotel-created, verified reusable call link here; blank keeps calling hidden.
export const ZUNGU_WHATSAPP_CALL_LINK = '';
export const ENQUIRY_ID_PREFIX = 'ZG-';
export function whatsappCallLink(value = ZUNGU_WHATSAPP_CALL_LINK) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'call.whatsapp.com' &&
      !url.port && !url.username && !url.password && /^\/(voice|video)\/[A-Za-z0-9_-]+$/.test(url.pathname) &&
      !url.search && !url.hash ? url.href : null;
  } catch { return null; }
}
