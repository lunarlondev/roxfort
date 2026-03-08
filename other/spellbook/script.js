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
  jég:{icon:"❄",label:"Jég / fagy"},
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
  tárgymozgatás:{icon:"🪶",label:"Telekinézis"},

  idézés:{icon:"📣",label:"Idézés"},
  irányítás:{icon:"🎯",label:"Irányítás"},
  láthatatlanság:{icon:"👁‍🗨",label:"Láthatatlanság"},
  illúzió:{icon:"🎭",label:"Illúzió"},

  háztartásmágia:{icon:"🧹",label:"Háztartásmágia"},
  párbajvarázslat:{icon:"⚔",label:"Párbajvarázslat"}
};


/* JSON betöltés */

async function init(){

  try{

    const res = await fetch("spells.json");
    spells = await res.json();

    render();

  }catch(e){

    console.error("Nem sikerült betölteni a spells.json fájlt", e);

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
  const dark = document.getElementById("dark").checked;
  const csakev = document.getElementById("csakev").checked;
  const custom = document.getElementById("custom").checked;

  const lista = document.getElementById("lista");

  lista.innerHTML="";


  const talalatok = spells.filter(s => {

    /* keresés */

    if(keres){

      const text = (
        s.name+" "+
        (s.hu||"")+" "+
        (s.description||"")+" "+
        (s.effects||[]).join(" ")
      ).toLowerCase();

      if(!text.includes(keres)) return false;

    }

    /* év szűrés */

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

    if(kat && s.category !== kat) return false;
    if(dark && !s.dark) return false;
    if(custom && !s.custom) return false;

    return true;

  });


  if(talalatok.length===0){

    lista.innerHTML="<p>Nincs találat.</p>";
    return;

  }


  talalatok.forEach(s => {

    const div = document.createElement("div");
    div.className="spell "+s.category;

    let icons="";

    if(s.custom) icons+="⭐";
    if(s.dark) icons+="☠";
    if(s.healing) icons+="✚";
    if(s.rare) icons+="📜";

    if(s.effects){

      s.effects.forEach(e=>{

        if(effectData[e]){

          icons+=`<span class="effect" title="${effectData[e].label}">
          ${effectData[e].icon}
          </span>`;

        }

      });

    }

    let evszoveg="";

    if(s.year==0) evszoveg="Ismeretlen";
    else if(s.year==8) evszoveg="Felsőoktatás";
    else evszoveg=s.year+". év";

    div.innerHTML=`

    <div class="icons">${icons}</div>

    <div class="year">${evszoveg}</div>

    <div class="nev">
    ${s.name}
    <span class="hu">(${s.hu || "-"})</span>
    </div>

    <div class="desc">
    ${s.description || ""}
    </div>

    <div class="tags">

    <span class="tag">${categoryNames[s.category] || s.category}</span>

    ${(s.effects||[])
      .map(e=>`<span class="tag">${e}</span>`)
      .join("")}

    </div>

    <a href="${s.wiki}" target="_blank">Fandom oldal</a>

    `;

    lista.appendChild(div);

  });

}