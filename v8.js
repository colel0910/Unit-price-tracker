(()=>{
'use strict';
// This scanner attaches in the capture phase to replace the older BarcodeDetector-only handler.
const $=id=>document.getElementById(id);
const button=$('scan'), stopButton=$('stop');
if(!button) return;
let active=false, html5=null, stream=null, detector=null, raf=0, generation=0, busy=false;
const status=s=>{$('scanStatus').textContent=s};
const info=s=>{$('v8lookupStatus').textContent=s};
const goodCode=x=>/^\d{8,14}$/.test(String(x||'').trim());
function loadScannerLib(){
 if(window.Html5Qrcode) return Promise.resolve(window.Html5Qrcode);
 return new Promise((resolve,reject)=>{
  const tag=document.createElement('script');
  tag.src='https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
  tag.async=true;
  const timer=setTimeout(()=>reject(Error('Scanner library timed out')),12000);
  tag.addEventListener('load',()=>clearTimeout(timer));tag.addEventListener('error',()=>clearTimeout(timer));
  tag.onload=()=>window.Html5Qrcode?resolve(window.Html5Qrcode):reject(Error('Scanner library unavailable'));
  tag.onerror=()=>reject(Error('Camera library could not load. Check your internet connection.'));
  document.head.appendChild(tag);
 });
}
async function stop(){
 active=false;generation++;cancelAnimationFrame(raf);
 if(html5){const h=html5;html5=null;try{await h.stop()}catch{}try{h.clear()}catch{}}
 if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
 const video=$('video');video.pause();video.srcObject=null;video.style.display='none';
 $('scanner').style.display='none';$('v8camera').innerHTML='';busy=false;
}
const card=document.createElement('div');card.id='scanResult';card.className='notice hidden';card.setAttribute('aria-live','polite');$('v8lookupStatus').after(card);
function showProduct(code,p,message){
 card.replaceChildren();card.classList.remove('hidden');
 const title=document.createElement('strong');title.textContent=p?.product_name||p?.product||'Barcode '+code;card.append(title);
 const detail=document.createElement('p');detail.textContent=message;card.append(detail);
 const add=document.createElement('button');add.textContent='Add a store price';add.onclick=()=>{if(window.unitpriceNavigate)window.unitpriceNavigate('manage');else showTab('manage');$('barcode').value=code;$('product').focus()};card.append(add);
 const reports=document.createElement('button');reports.className='alt';reports.style.margin='8px';reports.textContent='View community prices';reports.onclick=()=>{if(window.unitpriceNavigate)window.unitpriceNavigate('community');else document.querySelector('[data-v7tab]').click()};card.append(reports);
}
async function handleCode(value){
 const code=String(value||'').trim().replace(/[ -]/g,'');
 if(!goodCode(code)){info('Please enter a barcode with 8–14 digits.');return;}
 if(busy)return;
 busy=true;await stop();busy=true;
 const lookupButton=$('v8manualLookup');lookupButton.disabled=true;
 $('search').value=code;$('v8manualCode').value=code;$('barcode').value=code;
 ['product','brand'].forEach(id=>$(id).value='');
 info('Barcode '+code+' recognized. Looking up product details…');
 card.classList.add('hidden');
 // An exact saved barcode remains an exact match; public product details never fabricate prices.
 const local=allPrices().find(x=>String(x.barcode)===code);
 renderDeals();window.dispatchEvent(new CustomEvent('unitprice-barcode',{detail:{code}}));
 if(local){$('product').value=local.product;$('brand').value=local.brand||'';showProduct(code,local,'Your saved price matches this barcode. Community reports are available separately.');info('Found in your saved prices.');busy=false;lookupButton.disabled=false;return;}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{
  const r=await fetch('https://world.openfoodfacts.org/api/v2/product/'+encodeURIComponent(code)+'.json',{headers:{Accept:'application/json'},signal:controller.signal});
  if(!r.ok)throw Error('Product database did not respond');
  const data=await r.json(),p=data.status===1?data.product:null;
  if(p){
   const name=p.product_name||p.generic_name||'';
   $('product').value=name;$('brand').value=p.brands||'';
   if(name){$('search').value=name;renderDeals();}
   showProduct(code,p,'Brand: '+(p.brands||'Not listed')+(p.quantity?' · Package: '+p.quantity:'')+'. Product identification does not include a current store price. Add a price or check community reports.');
   info('Product identified for barcode '+code+'.');
  }else{showProduct(code,null,'No product details found. You can still enter the product name and a store price.');info('Barcode recognized; product is missing from the public database.');}
 }catch(e){showProduct(code,null,'Product lookup is unavailable. You can still save the product and price manually, or try again.');info(e.name==='AbortError'?'Product lookup timed out. Try again.':'Could not reach the product database.');}
 finally{clearTimeout(timer);busy=false;lookupButton.disabled=false;}
}
async function nativeScan(myGeneration){
 detector=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128']});
 stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
 const video=$('video');video.style.display='block';video.srcObject=stream;
 await video.play();status('Scanning… aim at a barcode');
 async function tick(){
  if(!active||generation!==myGeneration)return;
  try{if(video.readyState>=2){const codes=await detector.detect(video);if(codes.length){await handleCode(codes[0].rawValue);return;}}}catch(e){status('Scanning… '+e.message)}
  if(active&&generation===myGeneration)raf=requestAnimationFrame(tick);
 }
 raf=requestAnimationFrame(tick);
}
async function start(){
 if(active)return;
 if(!navigator.mediaDevices?.getUserMedia){info('Camera scanning needs HTTPS and a browser with camera access. You can type the barcode below.');return;}
 active=true;let id=++generation;
 $('scanner').style.display='block';info('');status('Opening camera…');
 try{
  // html5-qrcode includes a decoder for browsers lacking the native BarcodeDetector (including iOS Safari).
  const Html5Qrcode=await loadScannerLib();
  if(!active||id!==generation)return;
  html5=new Html5Qrcode('v8camera',{verbose:false});
  await html5.start({facingMode:'environment'},{fps:10,qrbox:{width:260,height:150},aspectRatio:1.7778},decoded=>{if(active)handleCode(decoded)},()=>{});
  if(active)status('Scanning… center the barcode inside the box.');
 }catch(err){
  if(!active||id!==generation)return;
  try{if(window.BarcodeDetector){status('Trying built-in camera scanner…');await nativeScan(id);return;}}catch(e){err=e;}
  await stop();info('Could not start camera: '+(err?.message||err)+'. Check Safari camera permission, or type the barcode below.');
 }
}
button.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();start();},true);
stopButton.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();stop();},true);
$('v8manualLookup').addEventListener('click',()=>handleCode($('v8manualCode').value));
$('v8manualCode').addEventListener('keydown',e=>{if(e.key==='Enter')handleCode($('v8manualCode').value)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)stop()});
})();