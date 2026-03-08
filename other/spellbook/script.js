let spells=[]

let searched=false

async function init(){

const res=await fetch("spells.json")

spells=await res.json()

}

init()

document.querySelectorAll("input,select")
.forEach(e=>e.addEventListener("input",render))

function render(){

const keres=document.getElementById("kereses").value.toLowerCase()

const ev=parseInt(document.getElementById("ev").value)

const kat=document.getElementById("kategoria").value

const dark=document.getElementById("dark").checked

const lista=document.getElementById("lista")

lista.innerHTML=""

if(!keres && !ev && !kat && !dark){

lista.innerHTML="<p>Adj meg szűrőt a varázslatok kereséséhez.</p>"

return

}

const talalatok=spells.filter(s=>{

if(keres){

const text=(s.name+" "+s.hu+" "+s.effects.join(" ")).toLowerCase()

if(!text.includes(keres)) return false

}

if(ev && s.year>ev) return false

if(kat && s.category!==kat) return false

if(dark && !s.dark) return false

return true

})

if(talalatok.length===0){

lista.innerHTML="<p>Nincs találat.</p>"

return

}

talalatok.forEach(s=>{

const div=document.createElement("div")

div.className="spell"

div.innerHTML=`

<div class="nev">${s.name}</div>

<div class="meta">

Magyar: ${s.hu || "-"} |

Év: ${s.year}

</div>

<a href="${s.wiki}" target="_blank">Fandom oldal</a>

`

lista.appendChild(div)

})

}