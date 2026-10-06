// Change this to your Snapchat username
const SNAPCHAT = "podhaus";

const CATALOG = {
  6: [[16,75000],[32,85000],[64,95000],[128,110000]],
  7: [[32,130000],[128,150000],[256,170000]]
};
const COLORS = [["Pink","#f2a7c3"],["Blue","#6fa8e8"],["Beige","#e3d2b0"],["Space Grey","#7d7f86"]];
const pick = {};
const key = (g,gb) => g+"-"+gb;
const colorOf = (g,gb) => pick[key(g,gb)] || "Pink";
let cart = [];

const fmt = n => "N" + n.toLocaleString("en-NG");
const $ = s => document.querySelector(s);
const hex = n => COLORS.find(c=>c[0]===n)[1];
$("#snapLink") && ($("#snapLink").href = "https://www.snapchat.com/add/" + SNAPCHAT);

function render(){
  for(const g in CATALOG){
    const el = $("#g"+g);
    if (!el) continue;
    el.innerHTML =
      `<div class="head"><h2>${g}th Gen</h2><span class="sw">Same price in every colour</span></div>
       <div class="grid">${CATALOG[g].map(([gb,p])=>{
          const c = colorOf(g,gb);
          return `<div class="card"><div class="pod"><i style="--c:${hex(c)}"></i></div>
           <div><h3>${g}th Gen, ${gb}GB</h3><small>${c}, Grade A</small></div>
           <div class="chips">${COLORS.map(([n,h])=>
             `<button class="chip" style="--c:${h}" aria-label="${n}" title="${n}" aria-pressed="${c===n}" data-k="${key(g,gb)}" data-c="${n}"><i></i></button>`).join("")}</div>
           <div class="pr"><b>${fmt(p)}</b><button class="btn" data-add data-g="${g}" data-gb="${gb}" data-p="${p}">Add to cart</button></div></div>`;}).join("")}</div>`;
  }
}

function renderCart(){
  const total = cart.reduce((s,i)=>s+i.p*i.q,0);
  $("#count").textContent = cart.reduce((s,i)=>s+i.q,0);
  $("#total").textContent = fmt(total);
  const items = $("#items");
  if (!items) return;
  items.innerHTML = cart.length ? cart.map((i,x)=>
    `<div class="item"><div>${i.g}th Gen, ${i.gb}GB<small>${i.c} · ${fmt(i.p)}</small></div>
     <div class="qty"><button data-x="${x}" data-d="-1" aria-label="Remove one">-</button>${i.q}<button data-x="${x}" data-d="1" aria-label="Add one">+</button></div></div>`).join("")
    : `<p class="empty">Your cart is empty. Add an iPod to get started.</p>`;
}

document.addEventListener("click", e=>{
  const b = e.target.closest("button"); if(!b) return;
  if(b.dataset.c){ pick[b.dataset.k]=b.dataset.c; render(); }
  else if(b.hasAttribute("data-add")){ 
    const g=b.dataset.g, gb=+b.dataset.gb, p=+b.dataset.p, c=colorOf(g,gb);
    const hit = cart.find(i=>i.g==g&&i.gb==gb&&i.c==c);
    hit ? hit.q++ : cart.push({g,gb,p,c,q:1});
    renderCart(); b.textContent="Added"; setTimeout(()=>b.textContent="Add to cart",900);
  }
  else if(b.dataset.x){ 
    cart[b.dataset.x].q += +b.dataset.d;
    cart = cart.filter(i=>i.q>0); renderCart();
  }
});

$("#cartBtn") && ($("#cartBtn").onclick = ()=>$("#drawer") && $("#drawer").classList.add("open"));
$("#closeBtn") && ($("#closeBtn").onclick = ()=>$("#drawer") && $("#drawer").classList.remove("open"));
$("#drawer") && ($("#drawer").onclick = e=>{ if(e.target.id==="drawer") e.currentTarget.classList.remove("open"); });

$("#order") && ($("#order").onclick = ()=>{
  if(!cart.length){ alert("Add an iPod to your cart first."); return; }
  const lines = cart.map(i=>`- ${i.q} x ${i.g}th Gen ${i.gb}GB (${i.c}) - ${fmt(i.p*i.q)}`).join("\n");
  const total = cart.reduce((s,i)=>s+i.p*i.q,0);
  const msg = `Hi, I'd like to order:\n${lines}\nTotal: ${fmt(total)}\nName: ${$("#name").value}\nAddress: ${$("#addr").value}`;
  const done = ()=>{ alert("Order copied! Paste it into a chat with us on Snapchat."); window.open("https://www.snapchat.com/add/"+SNAPCHAT, "_blank"); };
  if (navigator.clipboard) { navigator.clipboard.writeText(msg).then(done, ()=>prompt("Copy your order, then send it on Snapchat:", msg)); }
  else { prompt("Copy your order, then send it on Snapchat:", msg); }
});

render(); renderCart();