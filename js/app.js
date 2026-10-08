const cfg=window.MAJORLEAGUE_CONFIG;
const categories=["Flower","Hash","Extracts","Edibles","Accessories","Special Offers"];
let products=[],cart=[],activeCategory="All";
const $=s=>document.querySelector(s);

function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

function parseCSV(text){
  const rows=[]; let row=[], cell="", quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"'){
      if(quoted && n==='"'){cell+='"';i++}
      else quoted=!quoted;
    }else if(c===","&&!quoted){row.push(cell.trim());cell=""}
    else if((c==="\n"||c==="\r")&&!quoted){
      if(c==="\r"&&n==="\n")i++;
      row.push(cell.trim());cell="";
      if(row.some(v=>v!==""))rows.push(row);
      row=[];
    }else cell+=c;
  }
  if(cell!==""||row.length){row.push(cell.trim());if(row.some(v=>v!==""))rows.push(row)}
  if(!rows.length)return[];
  const headers=rows.shift().map(h=>h.trim());
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??"").trim()])));
}

function productImage(p){
  if(p.ImageURL)return p.ImageURL;
  if(p.ProductID){
    return "assets/products/"+encodeURIComponent(p.ProductID)+".webp";
  }
  return "";
}

async function renderCategories(){
  const el=$("#categories");
  el.innerHTML=categories.map(c=>'<button class="category" data-cat="'+esc(c)+'" aria-label="'+esc(c)+'"><img class="category-art" alt=""></button>').join("");
  try{
    const r=await fetch("assets/majorleague-category-panels.txt?v=1",{cache:"no-store"});
    if(!r.ok)throw Error("category artwork "+r.status);
    const raw=atob((await r.text()).trim());
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    const url=URL.createObjectURL(new Blob([bytes],{type:"image/jpeg"}));
    el.querySelectorAll(".category-art").forEach(img=>{img.src=url});
  }catch(e){}
  el.onclick=e=>{const b=e.target.closest(".category");if(!b)return;activeCategory=b.dataset.cat;$("#shop").scrollIntoView({behavior:"smooth"});renderFilters();renderProducts()}
}
function renderFilters(){
  const el=$("#filters");
  el.innerHTML=["All",...categories].map(c=>'<button class="filter '+(activeCategory===c?"active":"")+'" data-filter="'+esc(c)+'">'+esc(c)+"</button>").join("");
  el.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.filter;renderFilters();renderProducts()})
}

function getVariants(p){
  if(Array.isArray(p.Variants)) return p.Variants;
  if(typeof p.Variants==="string"){
    try{const parsed=JSON.parse(p.Variants);if(Array.isArray(parsed))return parsed}catch(e){}
  }
  return [];
}

function renderProducts(){
  const list=activeCategory==="All"?products:products.filter(p=>(p.Category||"").toLowerCase()===activeCategory.toLowerCase());
  const visible=list.filter(p=>String(p.Stock??"1").trim()!=="0"&&String(p.Active??"TRUE").toLowerCase()!=="false");
  const el=$("#products");
  if(!visible.length){el.innerHTML='<div class="loading">No products available in this section.</div>';return}
  el.innerHTML=visible.map((p,i)=>{
    const img=productImage(p);
    const variants=getVariants(p);
    const variantMarkup=variants.length
      ? '<div class="variants">'+variants.map(v=>'<button class="variant" type="button">'+esc(v.label||v.name||"Variant")+(v.price?'<span>'+esc(v.price)+'</span>':"")+'</button>').join("")+'</div>'
      : "";
    return '<article class="product"><div class="product-media">'+(img?'<img src="'+esc(img)+'" alt="'+esc(p.Name)+'" loading="lazy" onerror="this.closest(\\'.product-media\\').classList.add(\\'image-missing\\')">':"")+(String(p.New).toLowerCase()==="true"||String(p.New)==="1"?'<span class="badge">NEW</span>':"")+'</div><div class="product-info"><h3>'+esc(p.Name)+'</h3><p>'+esc(p.Type||p.Category||"Majorleague")+'</p>'+variantMarkup+'<div class="price">'+esc(p.Price?cfg.CURRENCY+p.Price:"Enquire")+'</div><button class="add" data-add="'+i+'">Add to cart</button></div></article>'
  }).join("");
  el.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{cart.push(visible[+b.dataset.add]);renderCart()})
}

function renderCart(){
  const count=cart.length;
  $("#cartCount").textContent=count;
  $("#bottomCartCount").textContent=count;
  const el=$("#cartItems");
  el.innerHTML=count?cart.map((p,i)=>'<div class="cart-row"><span>'+esc(p.Name)+'</span><button data-remove="'+i+'">×</button></div>').join(""):'<p class="note">Your cart is empty.</p>';
  el.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);renderCart()});
  $("#cartTotal").textContent=count?count+" item"+(count===1?"":"s")+" — enquiry total shown on request":""
}

async function load(){
  renderCategories();renderFilters();
  try{
    const r=await fetch(cfg.CATALOGUE_URL,{cache:"no-store"});
    if(!r.ok)throw Error("catalogue "+r.status);
    const data=await r.json();
    products=Array.isArray(data)?data:[];
  }catch(e){products=[]}
  renderProducts();renderCart()
}

function openPanel(n){const p=$("#"+n+"Panel");p.classList.add("open");p.setAttribute("aria-hidden","false");if(n==="search")$("#searchInput").focus()}
function closePanels(){document.querySelectorAll(".panel.open").forEach(p=>{p.classList.remove("open");p.setAttribute("aria-hidden","true")})}
document.querySelectorAll("[data-panel]").forEach(b=>b.onclick=()=>openPanel(b.dataset.panel));
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closePanels);
document.querySelectorAll(".panel").forEach(p=>p.addEventListener("click",e=>{if(e.target===p)closePanels()}));
$("#searchInput").oninput=e=>{const q=e.target.value.toLowerCase();$("#searchResults").innerHTML=products.filter(p=>Object.values(p).join(" ").toLowerCase().includes(q)).slice(0,12).map(p=>'<div class="cart-row"><span>'+esc(p.Name)+'</span><span class="price">'+esc(p.Price?cfg.CURRENCY+p.Price:"Enquire")+'</span></div>').join("")};
$("#soundToggle").onclick=()=>{const v=$("#heroVideo");v.muted=!v.muted;$("#soundToggle").textContent=v.muted?"⌁":"♪"};
load();
