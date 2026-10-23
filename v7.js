(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE='unitprice_openprices_v7';
let cache={};try{cache=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
let lastCode='',request=0;
const money=n=>Number.isFinite(Number(n))?'$'+Number(n).toFixed(2):'—';
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(cache))}catch{}}
function codeOk(s){return /^\d{8,14}$/.test(String(s).trim())}
function normalize(raw){return (raw||[]).filter(p=>p&&p.currency==='USD'&&Number(p.price)>0&&p.type==='PRODUCT'&&p.duplicate_of==null).map(p=>({id:p.id,code:String(p.product_code||''),name:p.product?.product_name||p.product_name||'Product not named',brand:p.product?.brands||'',price:Number(p.price),date:p.date||'',store:p.location?.osm_brand||p.location?.osm_name||p.location?.osm_display_name||'Store not identified',city:p.location?.osm_address_city||'',state:p.location?.osm_address_country||'',unit:p.price_per||'UNIT',quantity:p.product?.quantity||'',url:`https://prices.openfoodfacts.org/app/prices/${p.id}`})).sort((a,b)=>b.date.localeCompare(a.date));}
function validDate(d){return /^\d{4}-\d{2}-\d{2}$/.test(d)?d:'Unknown date'}
function ageDays(d){const ms=Date.parse(d+'T00:00:00Z');return Number.isFinite(ms)?Math.max(0,Math.floor((Date.now()-ms)/86400000)):null}
function display(code,note=''){let e=cache[code],host=$('v7results');if(!e){$('v7status').textContent=note+'Enter a barcode and press Check prices to load reports.';host.innerHTML='<div class="empty">Scan a product or enter its barcode to check public price reports.</div>';return}let entries=e.rows||[];let fresh=entries.filter(p=>ageDays(p.date)!==null&&ageDays(p.date)<=30);$('v7status').textContent=note+`${$('v7city').value.trim()?'City filter: '+$('v7city').value.trim():'All cities — no city filter applied'}. Last checked: ${new Date(e.fetched).toLocaleString()} • ${entries.length} US-dollar report(s) • ${fresh.length} reported within 30 days`;
if(!entries.length){host.innerHTML='<div class="notice">No community prices found for this barcode in US dollars. Your existing saved and demo prices remain available in Find deals. No current retailer price can be confirmed.</div>';return}
const city=($('v7city').value||'').trim().toLowerCase(), list=city?entries.filter(x=>x.city.toLowerCase().includes(city)):entries;
$('v7status').textContent+=` • Showing ${Math.min(35,list.length)} of ${list.length} matching report(s)`;
const best=[...list].sort((a,b)=>a.price-b.price)[0];
host.innerHTML=`<p class="muted">These are <b>historical community-submitted observations</b>, not guaranteed prices available now. Different stores, promotions, dates, and package quantities can make prices incomparable. No live inventory is verified.</p><div class="grid">`+list.slice(0,35).map(p=>{let age=ageDays(p.date);return `<article class="deal"><div class="row"><span class="pill">${esc(p.store)}</span>${p===best?'<span class="pill">Lowest listed report*</span>':''}</div><strong>${esc(p.brand?p.brand+' — '+p.name:p.name)}</strong><div class="price">${money(p.price)}</div><div class="muted">${esc(p.quantity||'Package size not reported')} · ${esc(p.city||'City unknown')} · ${esc(p.state)}</div><div class="small">Reported ${esc(validDate(p.date))} ${age===null?'':`(${age} days ago)`} · ${esc(p.unit)}</div><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">View source report ↗</a></article>`}).join('')+`</div><p class="muted">*Lowest reported total price in the displayed results, NOT necessarily the best unit value or cheapest available local store.</p>`;
if(!list.length)host.innerHTML='<div class="empty">No matching reports for this city. Clear the city filter to see all available results.</div>';
}
async function lookup(raw,force=false,note=''){
 const code=String(raw||'').trim(),status=$('v7status');
 if(!codeOk(code)){status.textContent=note+'Enter or scan an 8–14 digit barcode first.';$('v7barcode').focus();return;}
 const id=++request;lastCode=code;$('v7barcode').value=code;
 if(!navigator.onLine){display(code);status.textContent=note+'You are offline. '+(cache[code]?'Showing saved reports; prices may be outdated.':'Connect to the internet to check price reports.');return;}
 if(!force&&cache[code]&&Date.now()-new Date(cache[code].fetched).getTime()<15*60*1000){display(code,note);return;}
 status.textContent=note+'Checking price reports…';$('v7go').disabled=true;$('v7refresh').disabled=true;
 $('v7results').innerHTML='<div class="notice" role="status">Looking for reports for barcode '+esc(code)+'…</div>';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),14000);
 try{const url='https://prices.openfoodfacts.org/api/v1/prices?product_code='+encodeURIComponent(code)+'&size=100';
 const resp=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});if(!resp.ok)throw Error('Service returned '+resp.status);
 const data=await resp.json();if(id!==request)return;
 cache[code]={rows:normalize(Array.isArray(data)?data:(data.items||data.results||[])),fetched:new Date().toISOString()};save();display(code,note);
 }catch(err){if(id!==request)return;if(cache[code])display(code);else $('v7results').innerHTML='<div class="notice">Price reports could not be loaded. This does not mean no prices exist. Try Refresh, or compare your saved prices in Find products.</div>';
 status.textContent=note+(err.name==='AbortError'?'Price lookup timed out.':'Could not reach the price service: '+err.message+'.')+(cache[code]?' Showing previously saved reports.':' Try Refresh.');
 }finally{clearTimeout(timer);if(id===request){$('v7go').disabled=false;$('v7refresh').disabled=false;}}
}
const tab=document.createElement('button');tab.dataset.v7tab='live';tab.textContent='🌍 Community prices';document.querySelector('.nav').appendChild(tab);
const sec=document.createElement('div');sec.id='v7Tab';sec.className='hidden';sec.innerHTML=`<section><h2>🌍 Free community price lookup <span class="pill">V7</span></h2><p class="notice">Open Prices is a public, crowdsourced database of observed grocery prices. Prices are <b>not live retailer feeds</b>. Only reported USD records appear here; listings may be missing or old. The app does not invent store prices.</p><div class="flex"><input id="v7barcode" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="Enter UPC / EAN barcode" aria-label="Product barcode"><button id="v7go">Check prices</button><button id="v7refresh" class="alt">↻ Refresh</button></div><div class="flex" style="margin-top:10px"><input id="v7city" placeholder="Optional: filter by city" aria-label="City filter"><button id="v7clear" class="alt">Clear city filter</button></div><p class="muted">Clearing the city filter shows existing reports from every city. It does not add missing store prices.</p><p class="muted" id="v7status" role="status" aria-live="polite">Ready. Barcode scans also trigger a community-price lookup.</p><div id="v7results" class="stack"><div class="empty">Enter a barcode to see reported prices and their observation dates.</div></div><p class="muted">Source: <a target="_blank" rel="noopener noreferrer" href="https://prices.openfoodfacts.org">Open Prices by Open Food Facts</a> · Data provided under ODbL. Compare exact package sizes and verify prices with the store before buying. This lookup checks for new reports when requested; it does not update your manually saved prices automatically.</p></section>`;
document.querySelector('main').insertBefore(sec,document.querySelector('main').lastElementChild);
function show(){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('main > div[id$="Tab"]').forEach(d=>d.classList.add('hidden'));document.querySelectorAll('[id^="v4"],[id^="v6"]').forEach(d=>{if(d.id.endsWith('Tab'))d.classList.add('hidden')});sec.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});let search=$('search')?.value.trim();if(codeOk(search)&&search!==lastCode)lookup(search);else if(lastCode)display(lastCode)}
tab.onclick=show;
for(const other of document.querySelectorAll('.nav button:not([data-v7tab])'))other.addEventListener('click',()=>sec.classList.add('hidden'));
$('v7go').onclick=()=>lookup($('v7barcode').value,true);
$('v7refresh').onclick=()=>lookup($('v7barcode').value,true);
$('v7barcode').onkeydown=e=>{if(e.key==='Enter')lookup(e.target.value,true)};
$('v7city').oninput=()=>{if(lastCode&&cache[lastCode])display(lastCode)};
$('v7clear').onclick=()=>{
 const hadFilter=!!$('v7city').value.trim();$('v7city').value='';
 const code=$('v7barcode').value.trim()||lastCode;
 const note=hadFilter?'City filter cleared. ':'All cities are already selected. ';
 if(!codeOk(code)){display('',note);$('v7barcode').focus();return;}
 if(cache[code]){display(code,note);if(!cache[code].rows.length)$('v7status').textContent+=' • No USD reports are available for this barcode in any city.';}
 else lookup(code,false,note);
};
window.addEventListener('unitprice-barcode',e=>{const code=e.detail?.code;if(codeOk(code)){lookup(code,true)}});
})();
