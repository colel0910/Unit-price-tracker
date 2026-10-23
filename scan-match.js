/* Package measurements and conservative product matching. */
(function(root){
'use strict';
const units={g:['mass',1/28.349523125],kg:['mass',1000/28.349523125],oz:['mass',1],lb:['mass',16],ml:['volume',1/29.5735295625],l:['volume',1000/29.5735295625],'fl oz':['volume',1],gal:['volume',128],count:['count',1]};
function measure(q,u){u=String(u||'').toLowerCase();const f=units[u];q=Number(q);return f&&Number.isFinite(q)&&q>0?{quantity:q,unit:u==='l'?'L':u,group:f[0],amount:q*f[1],label:f[0]==='mass'?'oz':f[0]==='volume'?'fl oz':'item'}:null;}
function size(p){
 if(typeof p.quantity==='number'&&p.unit)return measure(p.quantity,p.unit);
 if(p.product_quantity&&p.product_quantity_unit)return measure(p.product_quantity,p.product_quantity_unit);
 const raw=String(p.quantity||'').toLowerCase().replace(/,/g,'.').replace(/fluid ounces?/g,'fl oz').replace(/ounces?/g,'oz').replace(/pounds?/g,'lb').replace(/litres?|liters?/g,'l').replace(/grams?/g,'g').replace(/ct\b|pieces?|items?/g,'count');
 // Reject mixed/ambiguous sizes rather than accidentally counting a serving as a package.
 const multi=raw.match(/^\s*(\d+)\s*[x×]\s*([\d.]+)\s*(fl oz|kg|ml|oz|lb|gal|g|l|count)\s*$/);
 if(multi)return measure(Number(multi[1])*Number(multi[2]),multi[3]);
 const one=raw.match(/^\s*([\d.]+)\s*(fl oz|kg|ml|oz|lb|gal|g|l|count)\s*$/);return one?measure(one[1],one[2]):null;
}
const clean=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\b\d+(?:[.,]\d+)?\s*(?:fl\s*oz|ounces?|oz|lbs?|pounds?|grams?|kg|g|ml|liters?|litres?|l|gallons?|gal|ct|count|pack)\b/g,' ').replace(/\b(?:family|giant|party|value)\s*size\b/g,' ').replace(/[^a-z0-9%]+/g,' ').trim().replace(/\s+/g,' ');
function name(p){return p.product_name||p.product||p.displayName||p.generic_name||'';}
function brand(p){return clean(p.brands||p.brand||'');}
function identity(p){let n=clean(name(p));for(const b of brand(p).split(' ').filter(Boolean))n=n.split(' ').filter(t=>t!==b).join(' ');return n;}
function relation(a,b){if(String(a.code||a.barcode||'')&&String(a.code||a.barcode)===String(b.code||b.barcode))return 'exact';const an=identity(a),bn=identity(b);if(!an||!bn)return null;
 const fields=['flavor','variant','fat','diet'];if(fields.some(k=>a[k]&&b[k]&&clean(a[k])!==clean(b[k])))return null;
 if(an===bn)return !brand(a)||!brand(b)||brand(a)===brand(b)?'same':'alternative';
 const at=new Set(an.split(' ')),bt=new Set(bn.split(' ')),shared=[...at].filter(t=>bt.has(t)).length;
 // Loose matches are suggestions only; never declare savings against them.
 return shared>=Math.max(1,Math.ceil(Math.max(at.size,bt.size)*0.65))?'suggestion':null;
}
function relative(a,b){if(!a||!b||a.group!==b.group)return 'Size not comparable';return Math.abs(a.amount-b.amount)<Math.max(a.amount,b.amount)*0.005?'Same size':b.amount>a.amount?'Larger package':'Smaller package';}
const api={measure,size,clean,name,brand,identity,relation,relative};root.UnitScanMatch=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
