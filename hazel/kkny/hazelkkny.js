const data={
default:{
m:"Alapnézet",
q:"The world is cruel, therefore I won't be.",
i:"https://i.imgur.com/Lg1IUUD.png"
},
friends:{
m:"Barátok",
q:"Idézet helye.",
i:"https://i.imgur.com/bTTQhZ5.png"
},
enemies:{
m:"Ellenségek",
q:"Don't mistake my kindness for weakness.",
i:"https://i.imgur.com/4DeVeoz.png"
},
loves:{
m:"Szerelmek",
q:"Idézet helye.",
i:"https://i.imgur.com/4DeVeoz.png"
},
other:{
m:"Egyéb",
q:"It's not what the world holds for you, it's what you bring to it.",
i:"https://i.imgur.com/tLRmdR4.png"
}
};

const vTitle=document.getElementById("vTitle");
const vQuote=document.getElementById("vQuote");
const vImg=document.getElementById("vImg");
const buttons=document.querySelectorAll(".hk-menu button");

function setView(k){
const d=data[k];
vTitle.textContent=d.t;
vQuote.textContent=d.q;
vImg.src=d.i;
buttons.forEach(b=>b.classList.toggle("active",b.dataset.view===k));
}

buttons.forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.getElementById("cat").onclick=()=>setView("default");

setView("default");

function esc(s){
return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

document.getElementById("broccoli").onclick = () => {
  const t = esc(msgTitle.value || "Üzenet");
  const m = esc(msgBody.value).replace(/\n/g,"<br>");

  code.textContent =
`[center][html]
<div class="hk-embed">
<style>
.hk-embed{
max-width:350px;
margin:0 auto;
font-family:Georgia,serif;
background:#f4efe5;
border:1px solid #bfae90;
box-shadow:0 6px 14px rgba(0,0,0,.18);
position:relative;
overflow:hidden;
color:#3a2f22;
}
.hk-embed::before{
content:"";
position:absolute;
inset:0;
background:url("https://i.pinimg.com/736x/28/3c/51/283c51b1f3179c391c95063cd4ab2a8a.jpg");
background-size:240px;
opacity:.12;
pointer-events:none;
}
.hk-embed-inner{
position:relative;
padding:14px 14px 14px 18px;
}
.hk-embed-inner::before{
content:"";
position:absolute;
left:6px;
top:10px;
bottom:10px;
width:2px;
background:repeating-linear-gradient(
180deg,
#9b8666 0 4px,
transparent 4px 8px
);
opacity:.8;
}
.hk-embed-title{
font-weight:bold;
font-size:16px;
margin-bottom:6px;
}
.hk-embed-divider{
height:1px;
background:#bfae90;
margin:6px 0 8px;
}
.hk-embed-body{
line-height:1.5;
text-align:justify;
font-size:14px;
}
</style>
<div class="hk-embed-inner">
<div class="hk-embed-title">${t}</div>
<div class="hk-embed-divider"></div>
<div class="hk-embed-body">${m}</div>
</div>
</div>
[/html][/center]`;
};
