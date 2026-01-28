/* ======================
   ITALOK
   ====================== */

const drinks = [
  {
    name: "Lángnyelv whiskey",
    html: `<div class="glass lowball fire fireWhiskeyGlass fireIce"><div class="liquid"></div></div>`
  },
  {
    name: "Superior red",
    html: `<div class="wineWrap"><div class="glass wine red"><div class="liquid"></div></div><div class="wineStem"></div><div class="wineBase"></div></div>`
  },
  {
    name: "Guinness",
    html: `<div class="glass mug guinness"><div class="beer">${'<span class="bubble"></span>'.repeat(10)}</div><div class="foam"></div></div>`
  },
  {
    name: "Vajsör",
    html: `<div class="glass mug butterscotch"><div class="beer">${'<span class="bubble"></span>'.repeat(8)}</div><div class="foam"></div></div>`
  },
  {
    name: "Mézbor",
    html: `<div class="wineWrap"><div class="glass wine mead"><div class="liquid"></div></div><div class="wineStem"></div><div class="wineBase"></div></div>`
  },
  {
    name: "Jenkins-féle kerítésszaggató",
    html: `<div class="glass shot jenkins"><div class="liquid"></div></div>`
  },
  {
    name: "Langyos sör",
    html: `<div class="glass mug flatbeer"><div class="beer">${'<span class="bubble"></span>'.repeat(8)}</div></div>`
  },
  {
    name: "Törlés koktél",
    html: `<div class="glass shot erase"><div class="liquid"></div></div>`
  },
  {
    name: "Stohl-féle repohár",
    html: `<div class="glass cup stohl"><div class="liquid"></div></div>`
  }
];


const shelf = document.getElementById("barShelf");
let selectedDrinkHTML = "";

drinks.forEach(d=>{
  const el = document.createElement("div");
  el.className = "drinkCard";

  el.innerHTML = `
    ${d.html}
    <div class="drinkName">${d.name}</div>
  `;

  el.addEventListener("click",()=>{
    document.querySelectorAll(".drinkCard").forEach(c=>{
      c.classList.remove("selected");
    });

    el.classList.add("selected");
    selectedDrinkHTML = d.html;
    document.getElementById("previewDrink").innerHTML = d.html;
  });

  shelf.appendChild(el);
});



/* ======================
   KAPCSOLATOK
   ====================== */

const relationData = {
  friend:{ text:"Barátok között nincs szükség sok szóra, de a bizalom itt alapvetés.", image:"https://via.placeholder.com/200x200/2a2a2a/ffffff?text=Friend" },
  enemy:{ text:"Az ellenség az, akire figyelsz, mert egyszer már átlépett egy határt.", image:"https://via.placeholder.com/200x200/1a1a1a/ff5555?text=Enemy" },
  love:{ text:"A szerelem veszélyes terep, ahol minden döntés nyomot hagy.", image:"https://via.placeholder.com/200x200/2a1a2a/dd88ff?text=Love" },
  other:{ text:"Van, akit nem tudsz hova tenni – talán jobb is így.", image:"https://via.placeholder.com/200x200/222222/aaaaaa?text=Other" }
};

const tabs = document.querySelectorAll(".gemmaTabs button");
const box = document.getElementById("relationBox");

function loadRelation(key){
  const d = relationData[key];
  box.classList.remove("active");
  setTimeout(()=>{
    box.innerHTML = `
      <div class="relationImage" style="background-image:url('${d.image}')"></div>
      <div class="relationText">${d.text}</div>
    `;
    box.classList.add("active");
  },10);
}

tabs.forEach(btn=>{
  btn.addEventListener("click",()=>{
    tabs.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    loadRelation(btn.dataset.cat);
  });
});

// alapértelmezett
loadRelation("friend");

/* ======================
   PREVIEW + GENERÁLÁS
   ====================== */

const titleInput = document.getElementById("title");
const textInput = document.getElementById("text");
const previewTitle = document.getElementById("previewTitle");
const previewText = document.getElementById("previewText");
const output = document.getElementById("output");

titleInput.addEventListener("input",()=>{
  previewTitle.textContent = titleInput.value || "Cím";
});

textInput.addEventListener("input",()=>{
  previewText.textContent = textInput.value || "Üzenet helye…";
});

document.getElementById("generate").addEventListener("click",()=>{
output.value=`[html]
<style>
.gemmaGift{display:flex;gap:10px;align-items:flex-start;width:260px;background:#121212;border:1px solid #333;border-radius:14px;padding:10px}
.gemmaGiftText{margin-left:6px}
.gemmaGift h4{margin:0;font-size:12px;color:#fff}
.gemmaGift p{margin:4px 0 0;font-size:11px;line-height:1.4;color:#ccc;white-space:pre-line}

/* pohár alap */
.glass{position:relative;margin:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.35);overflow:hidden}
.liquid{position:absolute;left:2px;right:2px;bottom:2px;height:var(--fill,60%);background:var(--liquid,#555)}

/* formák */
.lowball{width:32px;height:34px;border-radius:6px}
.shot{width:26px;height:36px;clip-path:polygon(10% 0%,90% 0%,80% 100%,20% 100%)}
.mug{width:34px;height:44px;border-radius:4px;overflow:visible}
.cup{width:30px;height:52px;clip-path:polygon(8% 0%,92% 0%,82% 100%,18% 100%)}

/* jég */
.fireIce::before{content:"";position:absolute;width:9px;height:9px;background:rgba(255,255,255,.65);border-radius:2px;top:8px;left:8px;animation:iceFloat 3.6s ease-in-out infinite}
.fireIce::after{content:"";position:absolute;width:9px;height:9px;background:rgba(255,255,255,.65);border-radius:2px;top:14px;left:18px;animation:iceFloat 3.6s ease-in-out infinite;animation-delay:1.4s}
@keyframes iceFloat{0%{transform:translateY(0)}50%{transform:translateY(-4px)}100%{transform:translateY(0)}}

/* bor */
.wineWrap{position:relative}
.wine{width:30px;height:50px;clip-path:polygon(10% 0%,90% 0%,96% 18%,94% 32%,98% 50%,90% 66%,72% 82%,60% 100%,40% 100%,28% 82%,10% 66%,2% 50%,6% 32%,4% 18%)}
.wineStem{width:4px;height:16px;background:rgba(255,255,255,.45);margin:0 auto}
.wineBase{width:22px;height:6px;background:rgba(255,255,255,.18);border-radius:999px;margin:0 auto}

/* folyadék színek */
.fire{--liquid:linear-gradient(#ffdb57,#ff6a00,#b00000);--fill:58%}
.red{--liquid:linear-gradient(#7b0000,#3b0000);--fill:52%}
.clear{--liquid:rgba(220,245,255,.6);--fill:56%}
.green{--liquid:linear-gradient(#1f7a3a,#2ecc71,#6aff9a);--fill:60%}

/* mézbor */
.mead .liquid{background:linear-gradient(120deg,#b8860b,#f1c232,#ffe599,#f1c232,#b8860b);background-size:300% 300%;animation:meadFlow 14s ease-in-out infinite}
@keyframes meadFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* sör */
.beer{position:absolute;left:2px;right:2px;bottom:2px;top:16px;background:#0b0b0b;overflow:hidden}
.butterscotch .beer{background:linear-gradient(#e3b857,#f3d27a,#f8e6a8)}
.flatbeer .beer{background:linear-gradient(#d6c26a,#eadf9c,#f3eebf)}
.foam{position:absolute;top:2px;left:2px;right:2px;height:14px;background:radial-gradient(circle at 20% 70%,#fff 55%,transparent 56%),radial-gradient(circle at 50% 40%,#fff 55%,transparent 56%),radial-gradient(circle at 80% 70%,#fff 55%,transparent 56%),#f5f5f5;border-radius:6px 6px 4px 4px}
.bubble{position:absolute;bottom:-6px;width:2px;height:2px;background:rgba(255,255,255,.75);animation:beerBubble 7s linear infinite}
.bubble:nth-child(1){left:12%;animation-delay:0s}
.bubble:nth-child(2){left:28%;animation-delay:1.2s}
.bubble:nth-child(3){left:44%;animation-delay:.6s}
.bubble:nth-child(4){left:60%;animation-delay:1.8s}
.bubble:nth-child(5){left:76%;animation-delay:.3s}
@keyframes beerBubble{0%{transform:translateY(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(-120px);opacity:0}}
</style>
<div class="gemmaGift">
${selectedDrinkHTML}
<div class="gemmaGiftText">
<h4>${titleInput.value}</h4>
<p>${textInput.value}</p>
</div>
</div>
[/html]`;
});