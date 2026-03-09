const categoryNames = {
  charm: "Bűbájok",
  defense: "Védekezések",
  healing: "Gyógyítások",
  transfiguration: "Átváltoztatások / idézések",
  curse: "Ártások / rontások / átkok"
};

let spells = [];
let flagFilter = null;

const effectData = {
  tűz:{icon:"🔥",label:"Tűz"},
  víz:{icon:"🌊",label:"Víz"},
  jég:{icon:"❄",label:"Jég"},
  villám:{icon:"⚡",label:"Villám"},
  föld:{icon:"⛰️",label:"Föld"},
  levegő:{icon:"💨",label:"Levegő"},
  fény:{icon:"✨",label:"Fény"},
  sötétség:{icon:"🌑",label:"Sötétség"},
  robbanás:{icon:"💥",label:"Robbanás"},
  lökés:{icon:"🌬",label:"Erőhullám"},
  kötözés:{icon:"⛓",label:"Mozgáskorlátozás"},
  bénítás:{icon:"🪨",label:"Bénítás"},
  kábítás:{icon:"🌀",label:"Kábítás"},
  pajzs:{icon:"🛡",label:"Pajzs"},
  gyógyítás:{icon:"✚",label:"Gyógyítás"},
  vér:{icon:"🩸",label:"Vérmágia"},
  idő:{icon:"⏳",label:"Idő"},
  mozgás:{icon:"🏃🏼‍♀️",label:"Mozgás"},
  tárgymozgatás:{icon:"🪶",label:"Tárgymozgatás"},
  átváltoztatás:{icon:"🏆",label:"Átváltoztatás"},
  módosítás:{icon:"🌈",label:"Módosítás"},
  idézés:{icon:"📣",label:"Idézés"},
  irányítás:{icon:"🎯",label:"Irányítás"},
  láthatatlanság:{icon:"👁‍🗨",label:"Láthatatlanság"},
  illúzió:{icon:"🎭",label:"Illúzió"},
  háztartásmágia:{icon:"🧹",label:"Háztartásmágia"},
  párbajvarázslat:{icon:"⚔",label:"Párbajvarázslat"},
  vágás:{icon:"🔪",label:"Vágás"},
  test:{icon:"🫆",label:"Test"},
  elme:{icon:"🧠",label:"Elme"}
};

async function init(){

  const res = await fetch("spells.json");
  spells = await res.json();

  render();

}

init();

document.querySelectorAll("input,select")
.forEach(e => e.addEventListener("input", render));

function render(){

  const keres = document.getElementById("kereses").value.toLowerCase();
  const evValue = document.getElementById("ev").value;
  const ev = evValue === "" ? null : Number(evValue);
  const kat = document.getElementById("kategoria").value;
  const csakev = document.getElementById("csakev").checked;
  const customMode = document.getElementById("customMode").value;
  const missingMode = document.getElementById("missingMode").value;

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

    if(customMode === "hide" && s.custom) return false;
    if(customMode === "only" && !s.custom) return false;

    if(missingMode === "hide" && s.missing) return false;
    if(missingMode === "only" && !s.missing) return false;

    if(flagFilter && !s[flagFilter]) return false;

    return true;

  });

  if(talalatok.length===0){

    lista.innerHTML="<p>Nincs találat.</p>";
    return;

  }

  talalatok.forEach(s => {

    const div=document.createElement("div");
    div.className="spell "+s.category;

    let cornerIcons="";

    if(s.custom)
    cornerIcons+=`<span class="cornerIcon" title="Saját varázslat">⭐</span>`;

    if(s.dark)
    cornerIcons+=`<span class="cornerIcon" title="Sötét varázslat">☠</span>`;

    if(s.healing)
    cornerIcons+=`<span class="cornerIcon" title="Gyógyító varázslat">✚</span>`;

    if(s.missing)
    cornerIcons+=`<span class="cornerIcon" title="Oldalon nem szereplő varázslat">✖️</span>`;

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
  ? `<a class="wikiLink" href="${s.wiki}" target="_blank">
       <img src="fandom-color-codes.svg" alt="Fandom">
     </a>`
  : "";

       div.innerHTML=`

   ${cornerIcons ? `<div class="customStar">${cornerIcons}</div>` : ""}

   <div class="icons">${effectIcons}</div>

   <div class="year">${evszoveg}</div>

   <div class="nev">${s.name}</div>
   <div class="hu">${s.hu||"-"}</div>

   <div class="desc">${s.description||""}</div>

   ${wikiLink}

   `;

    lista.appendChild(div);

  });

}

document.querySelectorAll(".legendContent div")
.forEach(el=>{

  el.addEventListener("click",()=>{

    const effect = el.dataset.effect;
    const flag = el.dataset.flag;

    if(effect){
      document.getElementById("kereses").value = effect;
      flagFilter=null;
    }

    if(flag){
      flagFilter = flag;
    }

    render();

  });

});

document.getElementById("clearFilters").addEventListener("click", () => {

  document.getElementById("kereses").value="";
  document.getElementById("ev").value="";
  document.getElementById("kategoria").value="";

  document.getElementById("csakev").checked=false;
  document.getElementById("customMode").value="show";
  document.getElementById("missingMode").value="show";

  flagFilter=null;

  render();

});