import {HOTEL, whatsappCallLink, FLAGS, LIMITS, LANGUAGE_KEY, INTENT_FLAGS, REGISTRY_ONLY, ZUNGU_TAGS, EXPLORE_CATEGORIES} from './concierge-config.js';
import {I18N} from './concierge-i18n.js';
import {buildMessage, createBookingHandoff, normalizeLanguage, countNights, parseLocalDate} from './concierge-message.js';

const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const localISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
/** Explicit mounting only. Phase 3 will enhance public CTAs; this module does not intercept links. */
export function createConcierge({guideUrl='pages/neighbourhood.html',privacyUrl='pages/privacy.html',openWhatsApp}={}){
 let lang=normalizeLanguage(navigator.language),state='menu',values={},trigger=null,message=null,lastIntent='general';
 try{const stored=localStorage.getItem(LANGUAGE_KEY);if(['en','sw'].includes(stored))lang=stored;}catch{}
 let bookingHandoff=createBookingHandoff();
 const dialog=el('dialog',null,'zungu-concierge-v2');dialog.id='ask-dialog';dialog.setAttribute('aria-labelledby','zc-title');dialog.setAttribute('aria-describedby','zc-description');document.body.append(dialog);
 const t=()=>I18N[lang];
 function button(label,fn,cls='zc-button'){const b=el('button',label,cls);b.type='button';b.addEventListener('click',fn);return b;}
 function link(label,href){const a=el('a',label,'zc-button');a.href=href;if(/^https:/.test(href)){a.target='_blank';a.rel='noopener';}return a;}
 function snapshot(){const f=dialog.querySelector('form');if(f)values={...values,...Object.fromEntries(new FormData(f))};}
 function go(next){snapshot();state=next;values={};bookingHandoff=createBookingHandoff();render();}
 function render(focus=true){
  dialog.replaceChildren();dialog.lang=lang;
  const head=el('header',null,'zc-head'),brand=el('p','ASK ZUNGU HOTEL','zc-eyebrow'),crest=el('div',null,'zc-crest'),row=el('div',null,'zc-toolbar');
  const logo=el('img',null,'zc-logo');logo.src=new URL('../../images/logo/icon-512.png',import.meta.url).href;logo.alt='Zungu Hotel';logo.width=60;logo.height=60;logo.decoding='async';crest.append(logo);
  const languages=el('div',null,'zc-languages');languages.setAttribute('role','group');languages.setAttribute('aria-label',t().ui.language);
  for(const code of ['en','sw']){const b=button(code.toUpperCase(),()=>{snapshot();lang=code;try{localStorage.setItem(LANGUAGE_KEY,lang);}catch{}render(false);dialog.querySelector(`[data-language="${code}"]`).focus();});b.dataset.language=code;b.lang=code;b.setAttribute('aria-pressed',String(lang===code));languages.append(b);}
  const close=button('×',()=>dialog.close(),'zc-close');close.setAttribute('aria-label',t().ui.close);row.append(languages,crest,close);
  const title=el('h2',state==='menu'?t().ui.title:state==='sent'?t().ui.opened:t().ui[state]||t().requests[state]||({manageStay:t().ui.existing,guestService:t().requests.roomAssistance,guestFood:t().ui.food})[state]||t().ui.title);title.id='zc-title';title.tabIndex=-1;
  const description=el('p',t().ui.noInstant,'zc-muted');description.id='zc-description';head.append(brand,row,title,description);dialog.append(head);
  if(lang==='sw')dialog.append(el('p',t().ui.swDraft,'zc-draft')); // VERIFY: SW strings remain draft pending native review.
  const body=el('div',null,'zc-body');dialog.append(body);
  if(state==='menu')menu(body);else if(state==='sent')confirmation(body);else if(state==='explore'&&!values.category)exploreMenu(body);else form(body);
  const foot=el('footer',null,'zc-footer');foot.append(link(`${t().ui.call} ${HOTEL.phone}`,'tel:+'+HOTEL.whatsapp),link(t().ui.maps,HOTEL.maps),link(t().ui.privacy,privacyUrl));const callUrl=whatsappCallLink();if(callUrl)foot.prepend(link(lang==='sw'?'Piga Zungu kupitia WhatsApp':'Call Zungu on WhatsApp',callUrl));dialog.append(foot);
  if(focus&&dialog.open)title.focus();
 }
 function menu(body){
  const groups=[['planning',['availability','booking','rates','rooms','food','directions',...(FLAGS.transport?['transport']:[]),'general']],['existing',['manageStay']],['during',['guestService','problem','reception',...(FLAGS.housekeeping?['housekeeping']:[]),...(FLAGS.guestFood?['guestFood']:[]),...(FLAGS.checkoutHelp?['checkout']:[])]]];
  for(const [label,intents]of groups){const section=el('section',null,'zc-group');section.append(el('h3',t().ui[label]));for(const intent of intents){const text=intent==='manageStay'?t().ui.existing:intent==='guestService'?t().requests.roomAssistance:intent==='guestFood'?t().ui.food:t().ui[intent]||t().requests[intent];section.append(button(text,()=>go(intent),'zc-topic'));}if(label==='planning')section.append(button(t().ui.explore,()=>go('explore'),'zc-topic'));body.append(section);}
 }
 function exploreMenu(body){
  for(const category of EXPLORE_CATEGORIES){
   const a=link(t().exploreCategories[category.id],buildMessage('explore',{category:category.id},lang).url);
   a.addEventListener('click',e=>{if(e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();values={category:category.id};render();});
   body.append(a);
  }
  body.append(link(t().ui.fullGuide,guideUrl),button(t().ui.back,()=>go('menu')));
 }
 function form(body){
  const f=el('form');f.noValidate=true;
  const stay=['booking','availability'].includes(state),manage=state==='manageStay'||state==='changeArrival',guest=['guestService','reception','problem','housekeeping','checkout','guestFood'].includes(state);
  const fields=[];
  if(state==='explore')body.append(el('p',t().exploreCategories[values.category],'zc-muted'));
  if(state.startsWith('guide')){body.append(el('p',t().purposes[state],'zc-muted'));if(values.place)body.append(el('p',values.place+(values.area?' · '+values.area:'')));if(values.places)body.append(el('p',values.places.join(' · ')));}
  function field(key,type='text',required=false,options){
   const wrapper=el('div',null,'zc-field'),id='zc-'+key,label=el('label',(key==='name'&&manage?t().fields.bookingName:t().fields[key])+' · '+(required?t().ui.required:t().ui.optional));label.htmlFor=id;
   const input=el(type==='textarea'?'textarea':type==='select'?'select':'input');if(input.tagName==='INPUT')input.type=type;input.id=id;input.name=key;input.required=required;
   if(options)for(const option of options){const o=el('option',t().requests[option]);o.value=option;input.append(o);}
   if(type==='textarea'){input.rows=3;input.maxLength=LIMITS.note;}else if(type==='text'){input.maxLength=key==='room'?30:120;input.autocomplete=key==='name'?'name':'off';}
   if(key==='checkin')input.min=localISO(new Date());
   if(key==='guests'){input.min=1;input.max=10;input.step=1;}
   input.value=values[key]??(key==='guests'?'2':options?options[0]:'');
   const error=el('span',null,'zc-error');error.id=id+'-error';input.setAttribute('aria-describedby',error.id);
   wrapper.append(label);
   if(key==='guests'){const stepper=el('div',null,'zc-stepper');for(const delta of [-1,1]){const b=button(delta===-1?'−':'+',()=>{input.value=String(Math.max(1,Math.min(10,(Number(input.value)||1)+delta)));input.dispatchEvent(new Event('input',{bubbles:true}));});b.setAttribute('aria-label',delta===-1?t().ui.decreaseGuests:t().ui.increaseGuests);stepper.append(b);if(delta===-1)stepper.append(input);}wrapper.append(stepper);}else wrapper.append(input);
   wrapper.append(error);f.append(wrapper);fields.push({key,input,error});return input;
  }
  if(stay){field('checkin','date',true);field('checkout','date',true);const nights=el('p',null,'zc-muted');nights.id='zc-nights';nights.setAttribute('aria-live','polite');f.append(nights);field('guests','number',true);field('preference');field('name','text',true);field('note','textarea');}
  else if(manage){field('name','text',true);field('arrival','date',true);field('request','select',true,['changeArrival','rooms','directions',...(FLAGS.transport?['transport']:[]),'food','other']);field('details','textarea');}
  else if(guest){field('room');if(state==='guestService')field('request','select',true,['roomAssistance','reception']);field('details','textarea');}
  else if(state==='explore')field('question','textarea');
  else if(state==='rooms')field('preference');
  else if(state==='transport'){field('arrival','date',true);field('pickup','text',true);}
  else if(state==='general')field('details','textarea');
  if(state==='directions')f.append(link(t().ui.maps,HOTEL.maps));
  const alert=el('p',null,'zc-error');alert.setAttribute('role','alert');f.append(alert);
  const send=el('button',t().ui.send,'zc-send');send.type='submit';f.append(send);if(state!=='explore')f.append(el('p',t().ui.helper,'zc-muted'));f.append(button(t().ui.back,()=>go(state==='explore'?'explore':'menu')));body.append(f);
  const showError=(item,code)=>{item.error.textContent=t().errors[code]||t().errors.required;item.input.setAttribute('aria-invalid','true');};
  function dates(){if(!stay)return;const ci=f.elements.checkin,co=f.elements.checkout;try{const d=parseLocalDate(ci.value);d.setDate(d.getDate()+1);co.min=localISO(d);}catch{co.removeAttribute('min');}try{f.querySelector('#zc-nights').textContent=t().nights(countNights(ci.value,co.value));}catch{f.querySelector('#zc-nights').textContent='';}}
  dates();f.addEventListener('input',e=>{const item=fields.find(x=>x.input===e.target);if(item){item.error.textContent='';item.input.removeAttribute('aria-invalid');}alert.textContent='';dates();});
  f.addEventListener('submit',e=>{
   e.preventDefault();if(state==='sent')return;alert.textContent='';let invalid=false;
   for(const item of fields){item.error.textContent='';item.input.removeAttribute('aria-invalid');const value=item.input.value.trim();let code='';
    if(item.input.required&&!value)code='required';
    else if(item.input.type==='date'&&value){try{parseLocalDate(value);if(item.key==='checkin'&&value<localISO(new Date()))code='pastDate';if(item.key==='checkout'&&f.elements.checkin.value&&value<=f.elements.checkin.value)code='dateOrder';}catch{code='date';}}
    else if(item.key==='guests'&&(!Number.isInteger(Number(value))||Number(value)<1||Number(value)>10))code='guests';
    else if(item.input.maxLength>0&&value.length>item.input.maxLength)code=item.input.tagName==='TEXTAREA'?'noteLong':'messageLong';
    if(code){showError(item,code);invalid=true;}}
   if(invalid){fields.find(x=>x.input.getAttribute('aria-invalid')==='true').input.focus();return;}
   snapshot();let intent=state;
   if(manage)intent=values.request==='changeArrival'?'changeArrival':'manageStay';
   if(state==='reception'){intent='guestService';values.request='reception';}
   if(state==='guestFood'){intent='guestService';values.request='food';}
   try{message=stay?bookingHandoff(values,lang):buildMessage(intent,values,lang);}catch(error){const item=fields.find(x=>x.key===error.field);if(item){showError(item,error.code);item.input.focus();}else alert.textContent=t().errors[error.code]||t().errors.messageLong;return;}
   lastIntent=state;state='sent';render();
   // Small-screen/coarse-pointer devices use same-tab navigation. No submission analytics or persistence.
   const mobile=matchMedia('(max-width: 767px), (pointer: coarse)').matches;
   if(openWhatsApp)openWhatsApp(message.url,mobile);else if(mobile)location.assign(message.url);else window.open(message.url,'_blank','noopener');
  });
 }
 function confirmation(body){
  if(message?.payload)body.append(el('p',`${lang==='sw'?'Kumbukumbu ya ombi':'Enquiry reference'}: ${message.payload.enquiryId}`,'zc-muted'));
  body.append(link(t().ui.send,message.url));
  body.append(el('p',t().ui.didNotOpen));const status=el('p',null,'zc-muted');status.setAttribute('role','status');
  const fallback=el('textarea');fallback.readOnly=true;fallback.value=message?.text||'';fallback.hidden=true;fallback.rows=10;fallback.setAttribute('aria-label',t().ui.copyFallback);
  body.append(button(t().ui.copy,async()=>{try{await navigator.clipboard.writeText(message.text);status.textContent=t().ui.copied;}catch{fallback.hidden=false;status.textContent=t().ui.copyFallback;fallback.focus();fallback.select();}}),link(t().ui.callInstead,'tel:+'+HOTEL.whatsapp),status,fallback,button(t().ui.back,()=>{state=lastIntent;render();}));
 }
 dialog.addEventListener('close',()=>{values={};message=null;bookingHandoff=createBookingHandoff();dialog.replaceChildren();if(trigger?.isConnected)trigger.focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const nodes=[...dialog.querySelectorAll('button,a[href],input,select,textarea')].filter(n=>!n.disabled&&!n.hidden&&n.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&(document.activeElement===first||!nodes.includes(document.activeElement))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}});
 return {open(intent='menu',source=document.activeElement,initialFields={}){if(REGISTRY_ONLY.includes(intent)||(INTENT_FLAGS[intent]&&!FLAGS[INTENT_FLAGS[intent]])||!['menu','explore','manageStay','reception',...Object.keys(ZUNGU_TAGS)].includes(intent))return false;if(intent==='explore'&&initialFields.category&&!EXPLORE_CATEGORIES.some(c=>c.id===initialFields.category))return false;bookingHandoff=createBookingHandoff();trigger=source;state=intent;values={...initialFields};message=null;render(false);if(!dialog.open)dialog.showModal();dialog.querySelector('h2').focus();return true;},close(){dialog.close();},destroy(){dialog.close();dialog.remove();}};
}
