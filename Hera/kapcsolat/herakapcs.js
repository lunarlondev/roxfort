const heraKapcsLabels=[
  "Hard pass","Don't talk to me","You're annoying","I'm watching you",
  "Neutral ground",
  "You’re tolerated","You're interesting","I don't hate you","You're safe (for now)","You’re in my circle","Ride or die"
];

const heraKapcsTitle=document.getElementById("heraKapcsTitle");
const heraKapcsText=document.getElementById("heraKapcsText");
const heraKapcsRange=document.getElementById("heraKapcsRange");
const heraKapcsRangeLabel=document.getElementById("heraKapcsRangeLabel");

const heraKapcsPTitle=document.getElementById("heraKapcsPTitle");
const heraKapcsPText=document.getElementById("heraKapcsPText");
const heraKapcsPFill=document.getElementById("heraKapcsPFill");
const heraKapcsPScale=document.getElementById("heraKapcsPScale");

const heraKapcsCopy=document.getElementById("heraKapcsCopy");
const heraKapcsOutput=document.getElementById("heraKapcsOutput");

const heraKapcsEsc=(s)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");

const heraKapcsUpdate=()=>{
  const percent=parseInt(heraKapcsRange.value,10);
  const idx=Math.round(percent/10);
  const label=heraKapcsLabels[idx]||heraKapcsLabels[5];

  heraKapcsPTitle.textContent=heraKapcsTitle.value||"—";
  heraKapcsPText.innerHTML=heraKapcsEsc(heraKapcsText.value)||"—";
  heraKapcsPFill.style.width=percent+"%";
  heraKapcsPScale.textContent=label+" ("+percent+"%)";
  heraKapcsRangeLabel.textContent=heraKapcsPScale.textContent;
};

heraKapcsTitle.addEventListener("input",heraKapcsUpdate);
heraKapcsText.addEventListener("input",heraKapcsUpdate);
heraKapcsRange.addEventListener("input",heraKapcsUpdate);
heraKapcsUpdate();

const heraKapcsBuildExport=()=>{
  const title=heraKapcsEsc(heraKapcsTitle.value);
  const text=heraKapcsEsc(heraKapcsText.value);
  const percent=parseInt(heraKapcsRange.value,10);
  const idx=Math.round(percent/10);
  const label=heraKapcsLabels[idx]||heraKapcsLabels[5];

  return `[html]
<div class="kapcsolat-box">
  <div class="kapcsolat-title">${title}</div>
  <div class="kapcsolat-content">
    ${text}
    <div class="scale-bar"><div class="scale-fill" style="width:${percent}%"></div></div>
    <div class="scale-text">${label} (${percent}%)</div>
  </div>
</div>

<style>
.kapcsolat-box{max-width:380px;margin:20px auto;font-family:Georgia,serif}
.kapcsolat-title{font-size:15px;color:#4F7942;font-weight:bold;margin-bottom:8px}
.kapcsolat-content{padding:14px 12px;border:1px solid #4F7942;border-radius:6px;background:linear-gradient(180deg,#0b0b0b 0%, #0f0f0f 100%);color:#e6e6e6;font-size:12px;line-height:1.6;text-align:justify;box-shadow:0 0 8px rgba(0,0,0,0.4)}
.scale-bar{height:6px;background:#222;border-radius:3px;margin-top:10px}
.scale-fill{height:100%;background:#4F7942;border-radius:3px}
.scale-text{margin-top:6px;font-size:11px;color:#c7d0c7;text-align:center}
</style>
[/html]`;
};

heraKapcsCopy.addEventListener("click",async()=>{
  const html=heraKapcsBuildExport();
  heraKapcsOutput.value=html;
  try{await navigator.clipboard.writeText(html);}catch(e){}
});
