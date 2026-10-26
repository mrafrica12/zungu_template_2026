import {createConcierge} from './concierge-ui.js';
import {ZUNGU_TAGS,EXPLORE_CATEGORIES} from './concierge-config.js';
const base=new URL('../../../',import.meta.url);
const concierge=createConcierge({guideUrl:new URL('pages/neighbourhood.html',base).href,privacyUrl:new URL('pages/privacy.html',base).href});
const reverse=Object.fromEntries(Object.entries(ZUNGU_TAGS).map(([intent,tag])=>[tag,intent]));
document.addEventListener('click',event=>{
 const a=event.target.closest('a[href]');
 if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const url=new URL(a.href,location.href);if(url.hostname!=='wa.me'||url.pathname!=='/255766003050')return;
 const text=url.searchParams.get('text')||'',tag=text.match(/\[([A-Z-]+) · (?:EN|SW)\]$/)?.[1];
 let intent=a.dataset.concierge||reverse[tag]||'menu';
 if(a.hasAttribute('data-guide-help')||a.classList.contains('whatsapp-orbit')||intent==='general')intent='menu';
 const fields={};
 const category=EXPLORE_CATEGORIES.find(c=>c.tag===tag);
 if(category&&intent!=='menu'){intent='explore';fields.category=category.id;}
 for(const [label,key]of [['Place','place'],['Area','area']]){const value=text.match(new RegExp('^'+label+': (.+)$','m'))?.[1];if(value)fields[key]=value;}
 if(intent==='guideSaved')fields.places=text.split('\n').filter(line=>line.startsWith('• ')).map(line=>line.slice(2));
 if(!concierge.open(intent,a,fields))return;
 event.preventDefault();
 const toggle=document.querySelector('.nav-toggle');
 if(toggle?.getAttribute('aria-expanded')==='true')toggle.click();
});
