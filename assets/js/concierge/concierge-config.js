// Phase 1: isolated modules; not yet wired into the public website.
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
  review:'POST-STAY-REVIEW', guideCoffee:'WEB-GUIDE-COFFEE', guideFood:'WEB-GUIDE-FOOD',
  guideNature:'WEB-GUIDE-NATURE', guideMedical:'WEB-GUIDE-MEDICAL', guidePharmacy:'WEB-GUIDE-PHARMACY',
  guideTransport:'WEB-GUIDE-TRANSPORT', guideMoney:'WEB-GUIDE-MONEY', guideGroceries:'WEB-GUIDE-GROCERIES',
  guideShopping:'WEB-GUIDE-SHOPPING', guideFuel:'WEB-GUIDE-FUEL', guideExplore:'WEB-GUIDE-EXPLORE',
  guideSafety:'WEB-GUIDE-SAFETY', guideHelp:'WEB-GUIDE-HELP', guidePlace:'WEB-GUIDE-PLACE', guideSaved:'WEB-GUIDE-SAVED'
});
export const LIMITS = Object.freeze({ guests:10, note:200, message:999 });
export const LANGUAGE_KEY = 'zungu-concierge-language';
// Flags govern UI exposure, not pure template testing. Review is registry-only and must never be sent by this UI.
export const INTENT_FLAGS = Object.freeze({transport:'transport', housekeeping:'housekeeping', checkout:'checkoutHelp'});
export const REGISTRY_ONLY = Object.freeze(['review']);
