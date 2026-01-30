const titleEl=document.getElementById("vkTitle");
const msgEl=document.getElementById("vkMessage");
const outEl=document.getElementById("vkOutput");
const cardEl=document.getElementById("vkCard");
const imgEl=document.getElementById("vkImage");
const whisperEl=document.getElementById("vkWhisper");
const genBtn=document.getElementById("vkGenerate");

function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function rand(min,max){return Math.random()*(max-min)+min;}

function spawnLipstickSmear(){
  const rect=cardEl.getBoundingClientRect();
  const smear=document.createElement("div");
  smear.className="vk-smear";

  const x=rand(18,Math.max(18,rect.width-260));
  const y=rand(18,Math.max(18,rect.height-120));
  const r=rand(-18,14);

  smear.style.setProperty("--x",x+"px");
  smear.style.setProperty("--y",y+"px");
  smear.style.setProperty("--r",r+"deg");

  const a=rand(.55,.8);
  const b=rand(.25,.55);

  smear.style.background=
    "radial-gradient(closest-side at 25% 40%, rgba(255,47,145,"+a+") 0%, rgba(255,47,145,"+b+") 42%, rgba(255,47,145,0) 72%),"+
    "radial-gradient(closest-side at 65% 55%, rgba(180,0,78,"+b+") 0%, rgba(180,0,78,"+(b*.7)+") 45%, rgba(180,0,78,0) 78%),"+
    "linear-gradient(90deg, rgba(255,79,163,"+(b*.85)+"), rgba(255,159,214,0))";

  smear.style.boxShadow="0 18px 60px rgba(255,47,145,.22)";
  smear.style.border="1px solid rgba(255,47,145,.18)";

  cardEl.appendChild(smear);
  setTimeout(()=>{smear.remove();},1200);
}

const whispers=[
  "don’t make it cute if it’s serious",
  "she knows",
  "say it like you mean it",
  "cheerleader, duh!",
  "can't talk, telepathy only",
  "write it down. regret later"
];

let whisperIndex=Math.floor(Math.random()*whispers.length);

function showWhisper(){
  whisperIndex=(whisperIndex+1)%whispers.length;
  whisperEl.textContent=whispers[whisperIndex];
  whisperEl.style.opacity="1";
  whisperEl.style.transform="translateY(0)";
  setTimeout(()=>{
    whisperEl.style.opacity="0";
    whisperEl.style.transform="translateY(6px)";
  },2600);
}

setTimeout(showWhisper,900);
setInterval(showWhisper,7300);

genBtn.addEventListener("click",()=>{
  const title=titleEl.value.trim();
  const msg=msgEl.value.trim();
  if(!title||!msg){outEl.value="";return;}

  spawnLipstickSmear();
  showWhisper();

  const safeTitle=esc(title);
  const safeMsg=esc(msg).replace(/\n/g,"<br>");

  outEl.value=
`[center][html]<div style="max-width:580px;margin:30px auto;font-family:Inter,system-ui">
<style>
.vk-entry{width:350px;background:#ffe6f2;border-radius:26px;padding:20px;box-shadow:0 20px 60px rgba(255,79,163,.22)}
.vk-entry-title{font-size:20px;font-weight:700;color:#ff2f91;letter-spacing:.3px}
.vk-entry-line{width:40px;height:3px;border-radius:3px;background:#ff6db8;margin:10px 0 12px 0}
.vk-entry-text{font-size:12px;text-align: justify;line-height:1.7;color:rgba(80,20,55,.95)}
.vk-entry-meta{margin-top:12px;font-size:12px;color:rgba(132,45,90,.6)}
</style>
<div class="vk-entry">
<div class="vk-entry-title">${safeTitle}</div>
<div class="vk-entry-line"></div>
<div class="vk-entry-text">${safeMsg}</div>
</div>
</div>[/html][/center]`;
});
