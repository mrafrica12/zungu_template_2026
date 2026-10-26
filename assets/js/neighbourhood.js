(() => {
  'use strict';
  const places = window.ZUNGU_PLACES;
  const $ = id => document.getElementById(id);
  const key = 'zungu-neighbourhood-saved-v1';
  const validIds = new Set(places.map(p => p.id));
  let saved = new Set();
  let storageAvailable = true;
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(id => validIds.has(id))); } catch (_) { storageAvailable = false; }
  const state = {category:'All places',tag:'',query:'',area:'all',onlySaved:false};
  const categories = [['All places','✧'],['Your base','⌂'],['Food & drink','♧'],['Shopping','◇'],['Culture','▥'],['Coast & islands','≈'],['Getting around','↗']];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const directions = p => p.id === 'zungu' ? p.source : p.id === 'mbudya' ? 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.query) : 'https://www.google.com/maps/dir/?api=1&origin=-6.7383321%2C39.1907418&destination='+encodeURIComponent(p.query);
  $('categories').innerHTML = categories.map(([name,symbol]) => `<button class="category" data-category="${esc(name)}" aria-pressed="${name === state.category}"><span class="symbol" aria-hidden="true">${symbol}</span>${esc(name)}<span>${name==='All places'?places.length:places.filter(p=>p.category===name).length}</span></button>`).join('');
  $('tags').innerHTML = ['Dining','Shopping','Museum','Outdoors','Waterfront','Arrival'].map(tag => `<button class="tag" data-tag="${tag}" aria-pressed="false">${tag}</button>`).join('');
  function render() {
    const words = normalize(state.query).trim().split(/\s+/).filter(Boolean);
    const matches = places.filter(p => (state.category==='All places'||p.category===state.category) && (!state.tag||p.tags.includes(state.tag)) && (state.area==='all'||p.scope===state.area) && (!state.onlySaved||saved.has(p.id)) && words.every(w=>normalize([p.name,p.description,p.area,p.category,...p.tags].join(' ')).includes(w)));
    $('result-count').textContent = `${matches.length} ${matches.length===1?'place':'places'}${state.onlySaved?' in my list':''}`;
    $('saved-count').textContent = saved.size;
    $('saved-toggle').setAttribute('aria-pressed',String(state.onlySaved));
    document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
    document.querySelectorAll('[data-area]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.area===state.area)));
    document.querySelectorAll('[data-tag]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tag===state.tag)));
    $('cards').innerHTML = matches.map(p=>`<article class="place" id="place-${p.id}"><div class="place-top"><span class="place-category">${esc(p.category)} · ${esc(p.scope)}</span><button class="save" data-save="${p.id}" aria-pressed="${saved.has(p.id)}" aria-label="${saved.has(p.id)?'Remove':'Save'} ${esc(p.name)}${saved.has(p.id)?' from':' to'} my places">${saved.has(p.id)?'♥':'♡'}</button></div><div class="place-body"><h3>${esc(p.name)}</h3><p class="area">${esc(p.area)}</p><p class="description">${esc(p.description)}</p><div class="place-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><a class="source" href="${esc(p.source)}" target="_blank" rel="noopener">${p.id==='ndambi'||p.id==='zungu'?'Hotel location listing':'Visit website'} ↗</a></div><div class="place-actions"><a href="${esc(directions(p))}" target="_blank" rel="noopener">${p.id==='mbudya'?'Explore location':'Directions'} ↗</a><button data-map="${p.id}" aria-label="View ${esc(p.name)} on map">View on map ⤓</button></div></article>`).join('');
    $('empty').hidden=matches.length>0;
    $('empty-copy').textContent=state.onlySaved&&saved.size===0?'Save a place using its heart button, then find it here.':'Try another search, category or area — or clear your filters.';
    $('saved-footer').hidden=!state.onlySaved||saved.size===0;
    $('saved-footer').querySelector('p').textContent=storageAvailable?'Your list is saved on this device.':'Your list is available during this visit. Browser storage is unavailable.';
    const selected=places.filter(p=>saved.has(p.id));
    $('share-list').href='https://wa.me/255766003050?text='+encodeURIComponent('Hello Zungu Hotel, could you help me plan a visit to these places?\n\n'+selected.map(p=>'• '+p.name).join('\n'));
    const filters=[state.query?`Search: ${state.query}`:'',state.tag?`Tag: ${state.tag}`:''].filter(Boolean);
    $('active-filter').textContent=filters.join(' · '); $('active-filter').hidden=!filters.length;
  }
  function reset(){Object.assign(state,{category:'All places',tag:'',query:'',area:'all',onlySaved:false});$('search-input').value='';render();}
  $('search-form').addEventListener('submit',e=>{e.preventDefault();state.query=$('search-input').value;render();});
  $('search-input').addEventListener('input',()=>{state.query=$('search-input').value;render();});
  $('categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){state.category=b.dataset.category;render();}});
  $('tags').addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(b){state.tag=state.tag===b.dataset.tag?'':b.dataset.tag;render();}});
  $('area').addEventListener('click',e=>{const b=e.target.closest('[data-area]');if(b){state.area=b.dataset.area;render();}});
  $('saved-toggle').addEventListener('click',()=>{state.onlySaved=!state.onlySaved;render();});
  $('reset').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
  function showMap(p,scroll=true){$('map-name').textContent=p.name;$('map-area').textContent=p.area;$('map').src='https://maps.google.com/maps?q='+encodeURIComponent(p.query)+'&z=14&output=embed';$('map').title='Map showing '+p.name;$('map-directions').href=directions(p);$('map-directions').textContent=p.id==='mbudya'?'Explore location ↗':'Open directions ↗';$('map-fallback').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.query);if(scroll){$('map-heading').setAttribute('tabindex','-1');$('map-heading').focus({preventScroll:true});$('map-section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
  $('map-home').addEventListener('click',()=>showMap(places[0],false));
  $('cards').addEventListener('click',e=>{
    const save=e.target.closest('[data-save]');const map=e.target.closest('[data-map]');
    if(save){const id=save.dataset.save; saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem(key,JSON.stringify([...saved]));storageAvailable=true;}catch(_){storageAvailable=false;}render();const replacement=document.querySelector(`[data-save="${id}"]`);(replacement||$('saved-toggle')).focus();$('announcement').textContent=places.find(p=>p.id===id).name+(saved.has(id)?' saved to':' removed from')+' your places.';}
    if(map)showMap(places.find(p=>p.id===map.dataset.map));
  });
  window.addEventListener('storage',e=>{if(e.key===key){try{const value=JSON.parse(e.newValue||'[]');saved=new Set(Array.isArray(value)?value.filter(id=>validIds.has(id)):[]);render();}catch(_){/* Ignore malformed data from another tab. */}}});
  render();
})();
