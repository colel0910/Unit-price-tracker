(()=>{
'use strict';
const $=id=>document.getElementById(id),cost=$('cost'),servings=$('servings');
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:n>0&&n<0.01?4:2}).format(n);
const number=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:3}).format(n);
function validation(field,errorId,message){const bad=!!message;field.setAttribute('aria-invalid',String(bad));$(errorId).textContent=message;$(errorId).classList.toggle('hidden',!bad);}
function update(){
 const c=cost.valueAsNumber,s=servings.valueAsNumber;
 const hasCost=cost.value!==''||cost.validity.badInput,hasServings=servings.value!==''||servings.validity.badInput;
 const costError=hasCost&&(!Number.isFinite(c)||c<0||c>1000000||Math.abs(c*100-Math.round(c*100))>1e-6)?'Enter a cost from $0 to $1,000,000, using no more than two decimal places.':'';
 const servingsError=hasServings&&(!Number.isFinite(s)||s<0.001||s>1000000)?'Enter a number of servings from 0.001 to 1,000,000.':'';
 validation(cost,'costError',costError);validation(servings,'servingsError',servingsError);
 const valid=hasCost&&hasServings&&!costError&&!servingsError;
 $('result').classList.toggle('empty',!valid);$('breakdown').classList.toggle('hidden',!valid);
 if(!valid){$('perServing').textContent='—';$('equation').textContent=costError||servingsError?'Check the numbers above to calculate your cost.':'Enter both numbers to see your result.';$('breakdownRows').replaceChildren();return;}
 const rate=c/s;
 $('perServing').textContent=rate>0&&rate<0.0001?'Less than $0.0001':money(rate);
 $('equation').textContent=money(c)+' ÷ '+number(s)+(s===1?' serving':' servings')+' = cost per serving';
 const rows=[];
 for(const n of [1,2,3,4])if(n<s)rows.push({label:number(n)+(n===1?' serving':' servings'),price:rate*n});
 rows.push({label:'Whole package ('+number(s)+(s===1?' serving)':' servings)'),price:c});
 $('breakdownRows').replaceChildren(...rows.map(row=>{const tr=document.createElement('tr'),label=document.createElement('td'),value=document.createElement('td');label.textContent=row.label;value.textContent=row.price>0&&row.price<0.0001?'Less than $0.0001':money(row.price);tr.append(label,value);return tr;}));
}
for(const input of [cost,servings])input.addEventListener('input',update);
$('calculator').addEventListener('submit',ev=>{ev.preventDefault();update();});
$('clear').addEventListener('click',()=>{$('calculator').reset();update();cost.focus();});
update();
if('serviceWorker' in navigator){const hadController=!!navigator.serviceWorker.controller;let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!hadController||reloading)return;reloading=true;location.reload();});navigator.serviceWorker.register('./sw.js').catch(()=>{});}
})();
