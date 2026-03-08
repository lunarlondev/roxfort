const categoryNames = {

charm: "Bűbájok",
defense: "Védekezések",
healing: "Gyógyítások",
transfiguration: "Átváltoztatások / idézések",
curse: "Ártások / rontások / átkok"

}

let spells = []

/* effect rendszer */

const effectData = {

tűz:{icon:"🔥",label:"Tűz"},
víz:{icon:"🌊",label:"Víz"},
jég:{icon:"❄",label:"Jég / fagy"},
villám:{icon:"⚡",label:"Villám / elektromosság"},
fény:{icon:"✨",label:"Fényvarázs"},
sötétség:{icon:"🌑",label:"Sötétségmágia"},

robbanás:{icon:"💥",label:"Robbanás"},
lökés:{icon:"🌬",label:"Erőhullám"},
kötözés:{icon:"⛓",label:"Mozgáskorlátozás"},
bénítás:{icon:"🪨",label:"Bénító hatás"},
pajzs:{icon:"🛡",label:"Védőpajzs"},

gyógyítás:{icon:"✚",label:"Gyógyító mágia"},
méreg:{icon:"☠",label:"Méreg"},
vér:{icon:"🩸",label:"Vérmágia"},

mozgás:{icon:"🌀",label:"Mozgatás / teleport / taszítás"},
tárgymozgatás:{icon:"🪶",label:"Telekinézis"},

idézés:{icon:"📣",label:"Idézés"},
irányítás:{icon:"🎯",label:"Irányítás"},
láthatatlanság:{icon:"👁‍🗨",label:"Láthatatlanság"},
illúzió:{icon:"🎭",label:"Illúzió"},

háztartásmágia:{icon:"🧹",label:"Háztartási varázslat"},
párbajvarázslat:{icon:"⚔",label:"Párbajvarázslat"}

}

/* json betöltés */

async function init(){

try{

const res = await fetch("spells.json")
spells = await res.json()

}catch(e){

console.error("Nem sikerült betölteni a spells.json fájlt")

}

}

init()

/* szűrők */

document.querySelectorAll("input,select")
.forEach(e => e.addEventListener("input", render))

/* render */

function render(){

const keres = document.getElementById("kereses").value.toLowerCase()
const ev = parseInt(document.getElementById("ev").value)
const kat = document.getElementById("kategoria").value
const dark = document.getElementById("dark").checked
const csakev = document.getElementById("csakev").checked
const custom = document.getElementById("custom").checked

const lista = document.getElementById("lista")

lista.innerHTML=""

if(!keres && !ev && !kat && !dark && !custom){

lista.innerHTML="<p>Adj meg szűrőt a varázslatok kereséséhez.</p>"
return

}

/* szűrés */

const talalatok = spells.filter(s => {

if(keres){

const text = (
s.name+" "+
(s.hu||"")+" "+
(s.description||"")+" "+
(s.effects||[]).join(" ")
).toLowerCase()

if(!text.includes(keres)) return false

}

if(ev){

const year = Number(s.year)

/* 0. év speciális */

if(year === 0) return false

if(csakev){

if(year !== ev) return false

}else{

if(year > ev) return false

}

}

if(kat && s.category!==kat) return false
if(dark && !s.dark) return false
if(custom && !s.custom) return false

return true

})

if(talalatok.length===0){

lista.innerHTML="<p>Nincs találat.</p>"
return

}

/* kártyák */

talalatok.forEach(s => {

const div = document.createElement("div")

div.className="spell "+s.category

let icons=""

/* alap ikonok */

if(s.custom) icons+="⭐"
if(s.dark) icons+="☠"
if(s.healing) icons+="✚"
if(s.rare) icons+="📜"

/* effect ikonok */

if(s.effects){

s.effects.forEach(e=>{

if(effectData[e]){

icons+=`<span class="effect" title="${effectData[e].label}">
${effectData[e].icon}
</span>`

}

})

}

/* év szöveg */

let evszoveg=""

if(s.year==0) evszoveg="Ismeretlen"
else if(s.year==8) evszoveg="Felsőoktatás"
else evszoveg=s.year+". év"

/* html */

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

`

lista.appendChild(div)

})

}