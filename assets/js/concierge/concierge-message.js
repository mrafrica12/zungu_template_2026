import { HOTEL, ZUNGU_TAGS, LIMITS, REGISTRY_ONLY, ZUNGU_JOURNEY, EXPLORE_CATEGORIES, STAFF_REVIEW } from './concierge-config.js';
import { I18N } from './concierge-i18n.js';

export class MessageError extends Error {
  constructor(code, field='') { super(code); this.name='MessageError'; this.code=code; this.field=field; }
}
export const normalizeLanguage = lang => /^sw(?:-|$)/i.test(String(lang)) ? 'sw' : 'en';
// Numeric local-date construction avoids UTC parsing and rejects rolled-over dates.
export function parseLocalDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (!m) throw new MessageError('date');
  const y=Number(m[1]), month=Number(m[2]), day=Number(m[3]);
  const d=new Date(2000,0,1,12); d.setFullYear(y,month-1,day);
  if (y<1900 || y>9999 || d.getFullYear()!==y || d.getMonth()!==month-1 || d.getDate()!==day) throw new MessageError('date');
  return d;
}
export function formatDate(value, lang='en') {
  return new Intl.DateTimeFormat(normalizeLanguage(lang)==='sw'?'sw-TZ':'en-GB',
    {weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(parseLocalDate(value)).replace(/,/g,'');
}
export function countNights(checkin, checkout) {
  const a=parseLocalDate(checkin), b=parseLocalDate(checkout);
  // Noon-local dates plus rounding preserve calendar-night counts across DST changes.
  const n=Math.round((b-a)/86400000);
  if(n<1) throw new MessageError('dateOrder','checkout');
  return n;
}
const clean = value => String(value ?? '').replace(/[\r\n\u0000-\u001f\u007f\u2028\u2029]+/g,' ').trim();
export function buildMessage(intent, fields={}, lang='en') {
  lang=normalizeLanguage(lang);
  if(intent==='explore') {
    const category=EXPLORE_CATEGORIES.find(c=>c.id===fields.category);
    if(!category)throw new MessageError('intent','category');
    const t=I18N[lang], question=clean(fields.question);
    if(question.length>LIMITS.note)throw new MessageError('noteLong','question');
    const purpose=t.explorePurpose.replace('{category}',t.exploreCategories[category.id]);
    const text=[`${t.greeting}\n${purpose}`,question?`${t.exploreQuestion}: ${question}`:'',`${t.closing}\n[${category.tag} · ${lang.toUpperCase()}]`].filter(Boolean).join('\n\n');
    if(text.length>LIMITS.message)throw new MessageError('messageLong');
    return {text,url:`https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(text)}`,tag:category.tag};
  }
  if(!Object.hasOwn(ZUNGU_TAGS,intent) || REGISTRY_ONLY.includes(intent)) throw new MessageError('intent');
  const t=I18N[lang], f=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,Array.isArray(v)?v:clean(v)]));
  const rows=[], add=(key,value)=>{if(value) rows.push(`${t.fields[key]}: ${value}`);};
  for(const key of ['note','details']) if((f[key]||'').length>LIMITS.note) throw new MessageError('noteLong',key);
  const stay=['booking','availability'].includes(intent), manage=['manageStay','changeArrival'].includes(intent);
  if(stay){
    for(const key of ['checkin','checkout','guests','name']) if(!f[key]) throw new MessageError('required',key);
    const n=countNights(f.checkin,f.checkout), guests=Number(f.guests);
    if(!Number.isInteger(guests)||guests<1||guests>LIMITS.guests) throw new MessageError('guests','guests');
    add('checkin',formatDate(f.checkin,lang));
    add('checkout',`${formatDate(f.checkout,lang)} (${t.nights(n)})`);
    add('guests',String(guests)); add('preference',f.preference); add('name',f.name); add('note',f.note);
  } else if(manage){
    for(const key of ['name','arrival']) if(!f[key]) throw new MessageError('required',key);
    add('bookingName',f.name); add('arrival',formatDate(f.arrival,lang));
    const request=intent==='changeArrival'?'changeArrival':f.request;
    if(!Object.hasOwn(t.requests,request||'')) throw new MessageError('required','request');
    add('request',t.requests[request]); add('details',f.details);
  } else if(['guestService','housekeeping','problem','checkout'].includes(intent)){
    add('room',f.room);
    const request={housekeeping:'housekeeping',problem:'problem',checkout:'checkout'}[intent]||f.request||'roomAssistance';
    if(!Object.hasOwn(t.requests,request)) throw new MessageError('required','request');
    add('request',t.requests[request]); add('details',f.details);
  } else {
    if(f.arrival) add('arrival',formatDate(f.arrival,lang));
    for(const key of ['pickup','preference','name','place','area','details','note']) add(key,f[key]);
    if(intent==='guideSaved' && Array.isArray(f.places)) {
      const places=f.places.map(clean).filter(Boolean);
      if(places.length) rows.push(`${t.fields.places}:\n${places.map(p=>'• '+p).join('\n')}`);
    }
  }
  const tag=ZUNGU_TAGS[intent];
  const text=[`${t.greeting}\n${t.purposes[intent]}`,rows.join('\n'),
    `${stay?t.stayClosing:t.closing}\n[${tag} · ${lang.toUpperCase()}]`].filter(Boolean).join('\n\n');
  // Never silently truncate guest details or reference tags.
  if(text.length>LIMITS.message) throw new MessageError('messageLong');
  return {text,url:`https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(text)}`,tag};
}

/** Exact registry tag -> stage id; null for unknown/unregistered tags.
 * Accepts raw tags, not formatted [TAG · EN] strings. No DOM, storage or time access.
 */
export function getStageForTag(tag) {
  if(typeof tag !== 'string' || !Object.values(ZUNGU_TAGS).includes(tag))return null;
  const matches=ZUNGU_JOURNEY.filter(stage=>stage.tags.includes(tag));
  return matches.length===1 ? matches[0].stage : null;
}

/** International-format syntax validation only; does not verify ownership or WhatsApp registration. */
export function normalizeGuestNumber(value) {
 const input=String(value??'').trim();
 if(!/^\+[1-9][0-9 ()-]*$/.test(input))throw new MessageError('staffPhone','phone');
 const digits=input.replace(/[+ ()-]/g,'');
 if(!/^[1-9]\d{7,14}$/.test(digits))throw new MessageError('staffPhone','phone');
 return digits;
}
/** Staff-only draft builder. No storage, logging, DOM access or automatic sending. */
export function buildStaffMessage(intent,fields={},lang='en') {
 if(!['preArrival','review'].includes(intent))throw new MessageError('intent');
 lang=normalizeLanguage(lang);
 const phone=normalizeGuestNumber(fields.phone),name=clean(fields.name);
 if(!name||name.length>100||/[{}]/.test(name))throw new MessageError('staffName','name');
 let reviewReady=false;
 try{const u=new URL(STAFF_REVIEW.url);reviewReady=STAFF_REVIEW.enabled&&u.protocol==='https:'&&!u.username&&!u.password;}catch{}
 const blocked=intent==='review'&&!reviewReady;
 const replacements={name,maps:HOTEL.maps,reviewLink:reviewReady?STAFF_REVIEW.url:'{GOOGLE_REVIEW_LINK}'};
 const text=I18N[lang].staffMessages[intent].replace(/\{(name|maps|reviewLink)\}/g,(_,key)=>replacements[key])+`\n[${ZUNGU_TAGS[intent]} · ${lang.toUpperCase()}]`;
 if(text.length>LIMITS.message)throw new MessageError('messageLong');
 return {text,tag:ZUNGU_TAGS[intent],url:blocked?null:`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,blockedReason:blocked?'reviewLinkMissing':null};
}
