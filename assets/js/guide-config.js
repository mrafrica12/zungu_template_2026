import {buildMessage} from './concierge/concierge-message.js';
/* Small, reusable guide vocabulary. Collections stay empty until supported and curated. */
window.ZUNGU_GUIDE = (() => {
  const categories = [
    ['all','All Places','All places','all','compass','A little local knowledge, wherever your day takes you.'],
    ['coffee','Coffee Shops','Coffee','discover','cup','Need coffee? Start with a stop in Goba, or plan one into a day across Dar.'],
    ['food','Eat & Drink','Food','discover','food','Somewhere to eat, a place for a drink. Ask us what suits your plans.'],
    ['nature','Nature & Trails','Nature','discover','leaf','Want to get outside? Explore a forest or plan an island outing.'],
    ['things','Things to Do','Something to Do','discover','compass','A little culture, a local stop, or a day of exploring.'],
    ['medical','Hospital / Medical Care','Medical Help','essentials','medical','Find a facility and check directly which services are available.'],
    ['pharmacy','Pharmacy','Medicine','essentials','pharmacy','Find a pharmacy in Goba. Check current hours and availability before visiting.'],
    ['money','ATM & Money','Cash','essentials','card','A useful starting point for cash. Check current service, fees and card support with the bank.'],
    ['groceries','Groceries','Groceries','essentials','basket','Everyday shopping, without planning a whole day around it.'],
    ['shopping','Shopping','Shopping','discover','bag','From practical stops in Goba to a shopping outing across Dar.'],
    ['transport','Transport','Transport','essentials','route','Getting around? Keep these arrival points handy, or ask the hotel for help.'],
    ['fuel','Fuel','Fuel','essentials','fuel','A practical stop for drivers. Check current fuel availability before travelling.'],
    ['safety','Safety & Help','Safety & Help','essentials','shield','For local help, contact the hotel. For an emergency, contact local emergency services directly; do not wait for a WhatsApp reply.']
  ].map(([id,label,quick,group,icon,intro])=>({id,label,quick,group,icon,intro}));
  const collections = [
    {id:'all',label:'Any outing'},
    {id:'nearby',label:'Nearby · In Goba',description:'Goba locations; not a walking-distance estimate.'},
    {id:'worth-trip',label:'Worth the Trip',description:'Selected ideas for a dedicated outing. These are guide selections, not hotel endorsements.'},
    {id:'morning',label:'Morning Outdoors',future:true},
    {id:'half-day',label:'Half-Day Escape',future:true},
    {id:'breakfast',label:'Coffee & Breakfast',future:true}
  ];
  const paths={cup:'M4 8h12v7a5 5 0 0 1-10 0V8m10 1h2a3 3 0 0 1 0 6h-2M3 21h17M7 3v2m5-2v2',food:'M5 3v6m4-6v6M3 3v5a4 4 0 0 0 8 0V3M7 12v9M19 3c-3 3-3 7 0 9V3m0 9v9',leaf:'M20 3C8 2 2 8 5 15s15 6 15-12ZM4 21 15 10',compass:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4 6-3 5-5 3 3-5Z',medical:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z',pharmacy:'m8 4 12 12a4 4 0 0 1-6 6L2 10a4 4 0 0 1 6-6Zm-1 11 6-6',card:'M3 5h18v14H3ZM3 10h18M6 15h4',basket:'m8 3-4 7m12-7 4 7M2 10h20l-3 11H5Zm7 4v3m6-3v3',bag:'M4 7h16l1 14H3Zm4 0V5a4 4 0 0 1 8 0v2',route:'M4 3h5v5H4ZM15 16h5v5h-5ZM6 8v5a3 3 0 0 0 3 3h6M12 5h6v6m0-6-6 6',fuel:'M3 21V3h10v18M3 9h10m-12 12h14M13 12h2a2 2 0 0 1 2 2v3a2 2 0 0 0 4 0V8l-4-4',shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6ZM8 12l3 3 5-6'};
  const icon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[id]||paths.compass}"/></svg>`;
  const askLabels={coffee:'Ask Zungu About Coffee',food:'Ask Zungu About Food',nature:'Ask Zungu About Nature',medical:'Ask Zungu About Medical Care',pharmacy:'Ask Zungu About a Pharmacy',transport:'Ask Zungu About Transport'};
  const ask=id=>buildMessage('explore',{category:id},'en').url;
  const askPlace=p=>buildMessage('guidePlace',{place:p.name,area:p.area},'en').url;
  const askSaved=places=>buildMessage('guideSaved',{places:places.slice(0,12).map(p=>p.name)},'en').url;
  const normalize=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  function matches(p,state,saved){
    const words=normalize(state.query).trim().split(/\s+/).filter(Boolean);
    const text=normalize([p.name,p.type,p.description,p.area,p.scope,...p.tags,...p.categories.map(id=>{const c=categories.find(c=>c.id===id);return c.label+' '+c.quick;})].join(' '));
    return (state.category==='all'||p.categories.includes(state.category)) && (state.group==='all'||p.categories.some(id=>categories.find(c=>c.id===id).group===state.group)) && (!state.tag||p.tags.includes(state.tag)) && (state.area==='all'||p.scope===state.area) && (!state.onlySaved||saved.has(p.id)) && (state.collection==='all'||(state.collection==='nearby'?p.scope==='Goba':p.collections.includes(state.collection))) && words.every(w=>text.includes(w));
  }
  return {categories,collections,icon,ask,askPlace,askSaved,askLabels,matches};
})();
