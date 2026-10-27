import './guide-config.js';
(() => {
  'use strict';
  const G=window.ZUNGU_GUIDE, places=window.ZUNGU_PLACES.filter(p=>p.verified&&p.verificationStatus==='verified');
  const $=id=>document.getElementById(id);
  let saved=new Set(),searchTimer; // Page-memory only; language is the sole persisted preference.
  const defaults={category:'all',group:'all',tag:'',query:'',area:'all',collection:'all',onlySaved:false};
  const state={...defaults};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const track=event=>{try{if(window.dataLayer)window.dataLayer.push({event});else if(typeof window.gtag==='function')window.gtag('event',event);}catch(_){}};
  const directions=p=>p.mapsUrl||(p.id==='zungu'?p.source:'https://www.google.com/maps/'+(p.mapMode==='search'?'search/?api=1&query=':'dir/?api=1&destination=')+encodeURIComponent(p.query));
  document.querySelector('.category-picker').open=!matchMedia('(max-width:760px)').matches;
  $('categories').innerHTML=G.categories.map(c=>`<button class="category" data-category="${c.id}" aria-pressed="false">${G.icon(c.icon)}<span class="category-label">${esc(c.label)}</span><span>${c.id==='all'?places.length:places.filter(p=>p.categories.includes(c.id)).length}</span></button>`).join('');
  const quickOrder=['coffee','food','nature','pharmacy','medical','money','groceries','shopping','transport','fuel','things'];
  $('quick-needs').innerHTML=quickOrder.map(id=>{const c=G.categories.find(c=>c.id===id);return `<button data-need="${id}" aria-pressed="false">${G.icon(c.icon)}<span>${c.quick}</span></button>`;}).join('')+`<a href="${G.ask('all')}" data-guide-event="guide_ask_zungu" target="_blank" rel="noopener">${G.icon('shield')}<span>Something Else</span></a>`;
  $('tags').innerHTML=['Coffee','Dining','Shopping','Museum','Outdoors','Waterfront','Arrival'].map(tag=>`<button class="tag" data-tag="${tag}" aria-pressed="false">${tag}</button>`).join('');
  $('collections').innerHTML=G.collections.filter(c=>!c.future||places.some(p=>p.collections.includes(c.id))).map(c=>`<button data-collection="${c.id}" aria-pressed="false">${c.label}</button>`).join('');
  document.querySelectorAll('[data-guide-help]').forEach(a=>a.href=G.ask('all'));
  function render(){
    const matches=places.filter(p=>G.matches(p,state,saved));
    const category=G.categories.find(c=>c.id===state.category);
    $('result-count').textContent=`${matches.length} ${matches.length===1?'place':'places'}${state.onlySaved?' in my list':''}`;
    $('saved-count').textContent=saved.size;
    $('saved-toggle').setAttribute('aria-pressed',String(state.onlySaved));
    for(const [attr,value] of [['category',state.category],['need',state.category],['area',state.area],['tag',state.tag],['group',state.group],['collection',state.collection]])document.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr]===value)));
    $('context-title').textContent=state.onlySaved?'Your saved places':category.id==='all'?(state.group==='essentials'?'The practical things.':state.group==='discover'?'A little discovery.':'Where shall we start?'):category.label;
    $('context-copy').textContent=category.intro;
    $('category-ask').href=G.ask(category.id);
    $('category-ask').textContent=G.askLabels[category.id]||(category.id==='all'?'Ask Zungu Hotel':`Ask Zungu About ${category.label}`);
    $('care-note').hidden=!['medical','safety'].includes(category.id);
    const collection=G.collections.find(c=>c.id===state.collection);
    $('collection-note').textContent=collection.description||'';$('collection-note').hidden=!collection.description;
    $('cards').innerHTML=matches.map(p=>`<article class="place" id="place-${p.id}"><div class="place-top"><span class="place-category">${G.icon(G.categories.find(c=>c.id===p.categories[0]).icon)} ${esc(p.type)} · ${p.scope==='Goba'?'In Goba':'Across Dar'}</span><button class="save" data-save="${p.id}" aria-pressed="${saved.has(p.id)}" aria-label="${saved.has(p.id)?'Remove':'Save'} ${esc(p.name)}${saved.has(p.id)?' from':' to'} my places">${saved.has(p.id)?'♥':'♡'}</button></div><div class="place-body"><h3>${esc(p.name)}</h3><p class="area">${esc(p.area)}</p><p class="description">${esc(p.description)}</p>${p.hotelRecommended?'<p class="recommendation">Zungu Recommends</p>':''}<div class="place-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="place-details"><a class="source" href="${esc(p.source)}" target="_blank" rel="noopener">Place information ↗</a>${p.phone?`<a class="place-call" href="tel:${p.phone}" aria-label="Call ${esc(p.name)}">Call ↗</a>`:''}<button class="map-link" data-map="${p.id}" aria-label="View ${esc(p.name)} on map">View map</button></div></div><div class="place-actions"><a href="${esc(directions(p))}" data-guide-event="guide_place_directions" target="_blank" rel="noopener" aria-label="${p.mapMode==='search'?'Explore location of':'Directions to'} ${esc(p.name)}">${p.mapMode==='search'?'Explore location':'Directions'} ↗</a><a href="${esc(G.askPlace(p))}" data-guide-event="guide_ask_zungu" target="_blank" rel="noopener" aria-label="Ask Zungu about ${esc(p.name)}">Ask Zungu ↗</a></div></article>`).join('');
    $('empty').hidden=matches.length>0;
    $('empty-copy').textContent=state.onlySaved&&saved.size===0?'Save a place using its heart button, then find it here.':'No places match these filters. Try a broader search, or ask Zungu for a local suggestion.';
    $('empty-ask').href=G.ask(category.id);
    $('saved-footer').hidden=!state.onlySaved||saved.size===0;
    $('saved-footer').querySelector('p').textContent='Saved for this page visit only; refreshing clears your list.'+(saved.size>12?' Your WhatsApp draft includes the first 12 places.':'');
    $('share-list').href=G.askSaved(places.filter(p=>saved.has(p.id)));
    const filters=[state.query?`Search: ${state.query}`:'',state.tag?`Tag: ${state.tag}`:'',state.area!=='all'?state.area:'',state.collection!=='all'?collection.label:''].filter(Boolean);
    $('active-filter').textContent=filters.join(' · ');$('active-filter').hidden=!filters.length;
  }
  function reset(){Object.assign(state,defaults);$('search-input').value='';render();}
  function chooseCategory(id,focus=false){Object.assign(state,defaults,{category:id});$('search-input').value='';track('guide_category_'+id);render();if(focus){$('context-title').focus({preventScroll:true});$('results-start').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}}
  $('search-form').addEventListener('submit',e=>{e.preventDefault();state.query=$('search-input').value;clearTimeout(searchTimer);track('guide_search');render();});
  $('search-input').addEventListener('input',()=>{state.query=$('search-input').value;render();clearTimeout(searchTimer);searchTimer=setTimeout(()=>track('guide_search'),600);});
  $('categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)chooseCategory(b.dataset.category);});
  $('quick-needs').addEventListener('click',e=>{const b=e.target.closest('[data-need]');if(b)chooseCategory(b.dataset.need,true);});
  $('guide-groups').addEventListener('click',e=>{const b=e.target.closest('[data-group]');if(b){Object.assign(state,defaults,{group:b.dataset.group});$('search-input').value='';render();}});
  $('tags').addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(b){state.tag=state.tag===b.dataset.tag?'':b.dataset.tag;render();}});
  $('area').addEventListener('click',e=>{const b=e.target.closest('[data-area]');if(b){state.area=b.dataset.area;state.collection='all';render();}});
  $('collections').addEventListener('click',e=>{const b=e.target.closest('[data-collection]');if(b){state.collection=b.dataset.collection;state.area='all';render();}});
  $('saved-toggle').addEventListener('click',()=>{const onlySaved=!state.onlySaved;Object.assign(state,defaults,{onlySaved});$('search-input').value='';render();});
  $('reset').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
  function showMap(p,scroll=true){$('map-name').textContent=p.name;$('map-area').textContent=p.area;$('map-placeholder').hidden=true;$('map').hidden=false;$('map').src='https://maps.google.com/maps?q='+encodeURIComponent(p.query)+'&z=14&output=embed';$('map').title='Map showing '+p.name;$('map-directions').href=directions(p);$('map-fallback').href=directions(p);if(scroll){$('map-heading').setAttribute('tabindex','-1');$('map-heading').focus({preventScroll:true});$('map-section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
  $('map-load').addEventListener('click',()=>showMap(places[0],false));
  $('map-home').addEventListener('click',()=>showMap(places[0],false));
  $('cards').addEventListener('click',e=>{
    const save=e.target.closest('[data-save]'),map=e.target.closest('[data-map]');
    if(save){const id=save.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);track('guide_place_save');render();(document.querySelector(`[data-save="${id}"]`)||$('saved-toggle')).focus();$('announcement').textContent=places.find(p=>p.id===id).name+(saved.has(id)?' saved to':' removed from')+' your places.';}
    if(map)showMap(places.find(p=>p.id===map.dataset.map));
  });
  document.addEventListener('click',e=>{const a=e.target.closest('[data-guide-event]');if(a&&!a.href?.includes('wa.me/'))track(a.dataset.guideEvent);});
  // Avoid covering one-handed quick actions with the shared floating invitation.
  const orbit=document.querySelector('.whatsapp-orbit');
  if(orbit && 'IntersectionObserver' in window){
    let needsVisible=false;
    const syncOrbit=()=>{orbit.hidden=needsVisible&&matchMedia('(max-width:760px)').matches;};
    new IntersectionObserver(entries=>{needsVisible=entries[0].isIntersecting;syncOrbit();}).observe($('quick-needs'));
    window.addEventListener('resize',syncOrbit);
  }
  render();
})();
