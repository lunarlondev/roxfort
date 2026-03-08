const categoryNames = {
  charm: "Bűbájok",
  defense: "Védekezések",
  healing: "Gyógyítások",
  transfiguration: "Átváltoztatások / idézések",
  curse: "Ártások / rontások / átkok"
};

let spells = [];

/* effect rendszer */

const effectData = {
  tűz:{icon:"🔥",label:"Tűz"},
  víz:{icon:"🌊",label:"Víz"},
  jég:{icon:"❄",label:"Jég"},
  villám:{icon:"⚡",label:"Villám"},
  fény:{icon:"✨",label:"Fény"},
  sötétség:{icon:"🌑",label:"Sötétség"},
  robbanás:{icon:"💥",label:"Robbanás"},
  lökés:{icon:"🌬",label:"Erőhullám"},
  kötözés:{icon:"⛓",label:"Mozgáskorlátozás"},
  bénítás:{icon:"🪨",label:"Bénítás"},
  pajzs:{icon:"🛡",label:"Pajzs"},
  gyógyítás:{icon:"✚",label:"Gyógyítás"},
  méreg:{icon:"☠",label:"Méreg"},
  vér:{icon:"🩸",label:"Vérmágia"},
  mozgás:{icon:"🌀",label:"Mozgás"},
  tárgymozgatás:{icon:"🪶",label:"Tárgymozgatás"},
  átváltoztatás:{icon:"🏆",label:"Átváltoztatás"},
  módosítás:{icon:"🌈",label:"Módosítás"},
  idézés:{icon:"📣",label:"Idézés"},
  irányítás:{icon:"🎯",label:"Irányítás"},
  láthatatlanság:{icon:"👁‍🗨",label:"Láthatatlanság"},
  illúzió:{icon:"🎭",label:"Illúzió"},
  háztartásmágia:{icon:"🧹",label:"Háztartásmágia"},
  párbajvarázslat:{icon:"⚔",label:"Párbajvarázslat"},
  vágás:{icon:"🔪",label:"Vágás"}
};


/* JSON betöltés */

async function init(){

  try{

    const res = await fetch("spells.json");
    spells = await res.json();

    render();

  }catch(e){

    console.error("spells.json betöltési hiba",e);

  }

}

init();


/* szűrők */

document.querySelectorAll("input,select")
.forEach(e => e.addEventListener("input", render));


/* render */

function render(){

  const keres = document.getElementById("kereses").value.toLowerCase();

  const evValue = document.getElementById("ev").value;
  const ev = evValue === "" ? null : Number(evValue);

  const kat = document.getElementById("kategoria").value;
  const csakev = document.getElementById("csakev").checked;
  const custom = document.getElementById("custom").checked;

  const lista = document.getElementById("lista");

  lista.innerHTML="";


  const talalatok = spells.filter(s => {

    if(keres){

      const text = (
        (s.name||"")+" "+
        (s.hu||"")+" "+
        (s.description||"")+" "+
        (s.effects||[]).join(" ")
      ).toLowerCase();

      if(!text.includes(keres)) return false;

    }

    if(ev !== null){

      const year = Number(s.year);

      if(ev === 0){

        if(year !== 0) return false;

      }else{

        if(year === 0) return false;

        if(csakev){

          if(year !== ev) return false;

        }else{

          if(year > ev) return false;

        }

      }

    }

    if(kat){

      if(kat === "dark"){

        if(!s.dark) return false;

      }else{

        if(s.category !== kat) return false;

      }

    }

    if(custom && !s.custom) return false;

    return true;

  });


  if(talalatok.length===0){

    lista.innerHTML="<p>Nincs találat.</p>";
    return;

  }


  talalatok.forEach(s => {

    const div=document.createElement("div");
    div.className="spell "+s.category;

    /* BAL FELSŐ IKONOK */

    let cornerIcons="";

    if(s.custom) cornerIcons+="⭐";
    if(s.dark) cornerIcons+="☠";
    if(s.healing) cornerIcons+="✚";
    if(s.rare) cornerIcons+="📜";


    /* EFFECT IKONOK (jobb felső) */

    let effectIcons="";

    (s.effects||[]).forEach(e=>{

      if(effectData[e]){

        effectIcons+=`<span class="effect" title="${effectData[e].label}">${effectData[e].icon}</span>`;

      }

    });


    let evszoveg="";

    if(s.year==0) evszoveg="Ismeretlen";
    else if(s.year==8) evszoveg="Felsőoktatás";
    else evszoveg=s.year+". év";


    const wikiLink = s.wiki
      ? `<a href="${s.wiki}" target="_blank">Fandom oldal</a>`
      : "";


    div.innerHTML=`

    ${cornerIcons ? `<div class="customStar">${cornerIcons}</div>` : ""}

    <div class="icons">${effectIcons}</div>

    <div class="year">${evszoveg}</div>

    <div class="nev">${s.name}</div>
    <div class="hu">${s.hu||"-"}</div>

    <div class="desc">${s.description||""}</div>

    <div class="tags">

      <span class="tag">${categoryNames[s.category]||s.category}</span>

      ${(s.effects||[])
        .map(e=>`<span class="tag">${e}</span>`)
        .join("")}

    </div>

    ${wikiLink}

    `;

    lista.appendChild(div);

  });

}


/* legend szűrés */

document.querySelectorAll(".legendContent div")
.forEach(el=>{

  el.addEventListener("click",()=>{

    const effect = el.dataset.effect;
    const filter = el.dataset.filter;

    if(effect){
      document.getElementById("kereses").value = effect;
    }

    if(filter === "custom"){
      document.getElementById("custom").checked = true;
    }

    if(filter === "dark"){
      document.getElementById("kategoria").value = "dark";
    }

    if(filter === "healing"){
      document.getElementById("kategoria").value = "healing";
    }

    render();

  });

});


document.getElementById("clearFilters").addEventListener("click", () => {

  document.getElementById("kereses").value="";
  document.getElementById("ev").value="";
  document.getElementById("kategoria").value="";

  document.getElementById("csakev").checked=false;
  document.getElementById("custom").checked=false;

  render();

});