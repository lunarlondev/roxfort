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
    name: "Másnapos sör",
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
  friend:{ text:"Friendship is always<br>a sweet responsibility,<br>never an opportunity.", image:"https://i.pinimg.com/736x/1e/5f/fd/1e5ffd0b5b4c1bbc658886463fe7bd19.jpg" },
  family:{ text:"I will fight for my family<br>until my last breath.", image:"https://i.pinimg.com/736x/12/06/2b/12062bcf019d58f609092416c30ccc1d.jpg" },
  enemy:{ text:"I ask you to judge me<br>by the enemies<br>I have made.", image:"https://i.imgur.com/qmJrP00.jpeg" },
  love:{ text:"I love you not just because of<br>who you are,<br>but because of who I am<br>when I am with you.", image:"https://i.pinimg.com/1200x/e3/1d/60/e31d60f1518deee84c384937094794f5.jpg" },
  other:{ text:"When you walk to the edge of all the light<br>you have and take that first step into the darkness of the unknown,<br>you must believe that one of two things will happen:<br>there will be something solid for you to stand upon,<br>or you will be taught to fly.", image:"https://i.pinimg.com/1200x/77/a8/b1/77a8b14da4f6cd6d01fcac86d39012f7.jpg" }
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
output.value=`[center][html]
<style>
:root{--main:#7daa63}

/* DOBOZ */
.gemmaGift{display:flex;gap:10px;align-items:flex-start;width:280px;background:#121613;border:1px solid rgba(125,170,99,.45);border-radius:14px;padding:10px;box-shadow:0 0 0 1px rgba(125,170,99,.2),0 12px 28px rgba(0,0,0,.6)}
.gemmaGiftText{margin-left:6px}
.gemmaGift h4{margin:0;font-size:12px;color:#d7e6d1}
.gemmaGift p{margin:4px 0 0;font-size:11px;line-height:1.4;color:#a9b9a4;white-space:pre-line;min-height:60px}


/* POHÁR ALAP */
.glass{position:relative;margin:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.35);overflow:hidden}
.liquid{position:absolute;left:2px;right:2px;bottom:2px;height:var(--fill,60%);background:var(--liquid,#555)}

/* FORMÁK */
.lowball{width:40px;height:42px;border-radius:8px}
.shot{width:26px;height:36px;clip-path:polygon(10% 0%,90% 0%,80% 100%,20% 100%)}
.cup{width:30px;height:52px;clip-path:polygon(8% 0%,92% 0%,82% 100%,18% 100%)}
.mug{width:34px;height:44px;border-radius:4px;overflow:visible}

/* KORSÓ FÜL */
.mug::before{content:"";position:absolute;right:-14px;top:8px;width:16px;height:28px;border:3px solid rgba(255,255,255,.45);border-left:0;border-radius:0 14px 14px 0}
.mug::after{content:"";position:absolute;right:-9px;top:13px;width:8px;height:18px;background:#121613;border-radius:0 9px 9px 0}

/* === ALAP ITALSZÍNEK (EZ A KULCS) === */
.fire{--liquid:linear-gradient(#ffdb57,#ff6a00,#b00000);--fill:58%}
.red{--liquid:linear-gradient(#7b0000,#ff0000,#2a0000);--fill:52%}
.clear{--liquid:rgba(220,245,255,.6);--fill:56%}
.green{--liquid:linear-gradient(#1f7a3a,#2ecc71,#6aff9a);--fill:60%}

/* JÉG – WHISKEY */
.fireIce::before{content:"";position:absolute;width:9px;height:9px;background:rgba(255,255,255,.65);border-radius:2px;top:8px;left:8px;animation:iceFloat 3.6s ease-in-out infinite}
.fireIce::after{content:"";position:absolute;width:9px;height:9px;background:rgba(255,255,255,.65);border-radius:2px;top:14px;left:18px;animation:iceFloat 3.6s ease-in-out infinite;animation-delay:1.4s}
@keyframes iceFloat{0%{transform:translateY(0)}50%{transform:translateY(-4px)}100%{transform:translateY(0)}}

/* SÖR */
.beer{position:absolute;left:2px;right:2px;bottom:2px;top:16px;overflow:hidden}
.guinness .beer{background:#0b0b0b}
.butterscotch .beer{background:linear-gradient(#e3b857,#f3d27a,#f8e6a8)}
.flatbeer .beer{background:linear-gradient(#d6c26a,#eadf9c,#f3eebf)}
.foam{position:absolute;top:2px;left:2px;right:2px;height:14px;background:#f5f5f5;border-radius:6px 6px 4px 4px}
.bubble{position:absolute;bottom:-6px;width:2px;height:2px;background:rgba(255,255,255,.7);animation:beerBubble 7s linear infinite}
@keyframes beerBubble{0%{transform:translateY(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(-120px);opacity:0}}

/* MÉZBOR */
.mead .liquid{--liquid:linear-gradient(120deg,#b8860b,#f1c232,#ffe599,#f1c232,#b8860b);--fill:60%;background-size:300% 300%;animation:meadFlow 14s ease-in-out infinite}
@keyframes meadFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* borospoharak */
.wineWrap{display:flex;flex-direction:column;align-items:center}
.wine{width:34px;height:44px;clip-path:polygon(12% 0%,88% 0%,96% 20%,94% 38%,86% 56%,72% 74%,60% 100%,40% 100%,28% 74%,14% 56%,6% 38%,4% 20%)}
.wineStem{width:4px;height:14px;background:rgba(255,255,255,.45)}
.wineBase{width:22px;height:6px;background:rgba(255,255,255,.25);border-radius:999px}


/* SPECIÁLIS ANIMÁLT ITALOK */
.jenkins .liquid{top:12%;background:linear-gradient(#7fdcff,#b3ecff,#7fdcff);background-size:100% 200%;animation:jenkinsShear 6s ease-in-out infinite}
@keyframes jenkinsShear{0%{background-position:0% 0%}50%{background-position:0% 100%}100%{background-position:0% 0%}}

.erase .liquid{top:12%;background:linear-gradient(#5b2b82,#7d3cb5,#b57edc,#7d3cb5);background-size:100% 220%;animation:eraseShear 6.5s ease-in-out infinite}
@keyframes eraseShear{0%{background-position:0% 0%}50%{background-position:0% 100%}100%{background-position:0% 0%}}

.stohl .liquid{top:15%;background:linear-gradient(#1f7a3a,#2ecc71,#6aff9a);animation:stohlPulse 5s ease-in-out infinite}
@keyframes stohlPulse{0%,40%,100%{opacity:1}55%,70%{opacity:0}}
</style>
<div class="gemmaGift">
${selectedDrinkHTML}
<div class="gemmaGiftText">
<h4>${titleInput.value}</h4>
<p>${textInput.value}</p>
</div>
</div>
[/html][/center]`;
});