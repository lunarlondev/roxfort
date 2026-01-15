const pages=document.querySelectorAll(".bb-page");
let current=0;
const show=i=>{
  pages.forEach(p=>p.classList.remove("active"));
  pages[i].classList.add("active");
};

document.querySelector(".bb-cover").addEventListener("click",()=>{current=1;show(current);});
document.querySelector(".bb-next").addEventListener("click",()=>{if(current<pages.length-1){current++;show(current);}});
document.querySelector(".bb-prev").addEventListener("click",()=>{if(current>0){current--;show(current);}});
document.querySelector(".bb-home").addEventListener("click",()=>{current=0;show(current);});

/* PREVIEW FRISSÍTÉS */
const updatePreview=()=>{
  const t=document.getElementById("bbTitle").value||"RELATIONSHIP NOTE";
  const x=document.getElementById("bbText").value||"";

  document.getElementById("bbPreview").innerHTML=
`<div class="bb-statement">
  <div class="bb-statement-title">${t.toUpperCase()}</div>
  <div class="bb-statement-body">${x.replace(/\n/g,"<br>")}</div>
</div>`;
};

document.getElementById("bbTitle").addEventListener("input",updatePreview);
document.getElementById("bbText").addEventListener("input",updatePreview);

document.getElementById("bbGenerate").addEventListener("click",()=>{
  const t=document.getElementById("bbTitle").value||"RELATIONSHIP NOTE";
  const x=document.getElementById("bbText").value||"";

  document.getElementById("bbOutput").value=
`[html]
<div class="bb-statement">
  <div class="bb-statement-title">${t.toUpperCase()}</div>
  <div class="bb-statement-body">${x.replace(/\n/g,"<br>")}</div>
</div>

<style>
.bb-statement{width:360px;margin:26px auto;background:#e56a8b;border:2px solid #b03a63;font-family:Arial,Helvetica,sans-serif;box-shadow:0 0 0 3px rgba(255,255,255,.35),inset 0 -4px 0 rgba(176,58,99,.35)}
.bb-statement-title{padding:10px 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,255,255,.35);color:#5a2240;border-bottom:1px solid #b03a63}
.bb-statement-body{padding:14px 12px;font-size:13px;line-height:1.55;color:#4a1d35}
</style>
[/html]`;
});

/* BORÍTÓ BETŰ RANDOMIZÁLÁS */
(function(){
  const letters=document.querySelectorAll(".bb-cover-title .cut");
  if(!letters.length)return;

  letters.forEach(el=>{
    const rot=Math.floor(Math.random()*21)-10;
    el.style.transform=`rotate(${rot}deg)`;
  });

  const pick=letters[Math.floor(Math.random()*letters.length)];
  const cur=pick.style.transform||"";
  pick.style.transform=cur+" scaleX(-1)";
})();
