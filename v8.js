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
async function handleCode(value){
 const code=String(value||'').replace(/\D/g,'');
 if(!goodCode(code)){info('Please enter a barcode with 8–14 digits.');return;}
 if(busy)return;busy=true;
 await stop();busy=true;
 $('search').value=code;$('v8manualCode').value=code;$('barcode').value=code;
 info('Barcode '+code+' recognized. Looking up product details and community prices…');
 $('search').dispatchEvent(new Event('input',{bubbles:true}));
 window.dispatchEvent(new CustomEvent('unitprice-barcode',{detail:{code}}));
 try{
  const r=await fetch('https://world.openfoodfacts.org/api/v2/product/'+encodeURIComponent(code)+'.json',{headers:{'Accept':'application/json'}});
  if(!r.ok)throw Error('Product database did not respond');
  const data=await r.json(), p=data.status===1?data.product:null;
  const name=[p?.product_name,p?.brands].filter(Boolean).join(' — ');
  if(p){
   $('product').value=p.product_name||'';
   $('brand').value=p.brands||'';
   info('Scanned '+code+': '+(name||'product identified')+'. Community price reports are shown if available.');
  }else info('Barcode '+code+' scanned, but no product details were found. Check Community prices or add your own product.');
 }catch(e){info('Barcode '+code+' scanned. Product lookup unavailable right now; you can still save it manually.');}
 busy=false;
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