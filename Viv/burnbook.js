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
/* BORÍTÓ BETŰ RANDOMIZÁLÁS */
(function(){
  const letters = document.querySelectorAll(".bb-cover-title .cut");
  if(!letters.length) return;

  const fonts = [
    "'Permanent Marker', cursive",
    "'Bebas Neue', sans-serif",
    "'Anton', sans-serif",
    "'Oswald', sans-serif",
    "'Roboto Slab', serif",
    "'Playfair Display', serif",
    "'DM Serif Display', serif",
    "'Abril Fatface', serif",
    "'Alfa Slab One', serif",
    "'Ultra', serif",
    "'Black Ops One', system-ui",
    "'Special Elite', monospace",
    "'Creepster', system-ui",
    "'Ewert', serif",
    "'Rubik Mono One', sans-serif",
    "'Monoton', system-ui",
    "'Fredericka the Great', serif",
    "'Luckiest Guy', system-ui",
    "'Rock Salt', cursive",
    "'Caveat', cursive",
    "'Kalam', cursive",
    "'Gloria Hallelujah', cursive",
    "'Indie Flower', cursive",
    "'Shadows Into Light', cursive",
    "'Patrick Hand', cursive",
    "'Handlee', cursive",
    "'Nothing You Could Do', cursive",
    "'Architects Daughter', cursive",
    "'Neucha', cursive",
    "'Gaegu', cursive",
    "'Amatic SC', cursive",
    "'Press Start 2P', monospace",
    "'VT323', monospace",
    "'Orbitron', sans-serif",
    "'Righteous', system-ui",
    "'Fugaz One', system-ui",
    "'Boogaloo', system-ui",
    "'Changa One', system-ui",
    "'PT Sans Narrow', sans-serif",

    /* biztonsági (ha valami nem tölt be) */
    "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    "'Segoe Script', cursive",
    "'Lucida Handwriting', cursive",
    "'Brush Script MT', cursive",
    "Georgia, serif",
    "Arial, Helvetica, sans-serif"
  ];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  letters.forEach(el => {
    /* reset: ne a hand1/2/3/4 class döntsön */
    el.style.fontFamily = pick(fonts);

    /* random fekete/fehér “cut-out” */
    const dark = Math.random() < 0.5;
    el.style.background = dark ? "#000" : "#fff";
    el.style.color = dark ? "#fff" : "#000";

    /* random kis/nagybetű vegyesen */
    const raw = (el.textContent || "").trim();
    if(raw) {
      el.textContent = Math.random() < 0.55 ? raw.toUpperCase() : raw.toLowerCase();
    }

    /* random “papír” méret érzet */
    el.style.fontSize = rand(30, 44) + "px";
    el.style.padding = rand(4, 9) + "px " + rand(7, 13) + "px";
    el.style.letterSpacing = (Math.random() < 0.4 ? rand(-2, 2) : 0) + "px";

    /* random rotáció (marad a meglévő logika, csak itt pontosítva) */
    const rot = rand(-12, 12);
    el.dataset.rot = String(rot);
    el.dataset.flip = "0";
    el.style.transform = "rotate(" + rot + "deg)";
  });

  /* 1 random betű tükrözése (már megvolt, itt stabilan együtt kezeli a rotációval) */
  const chosen = letters[Math.floor(Math.random() * letters.length)];
  const baseRot = chosen.dataset.rot || "0";
  chosen.dataset.flip = "1";
  chosen.style.transform = "rotate(" + baseRot + "deg) scaleX(-1)";
})();
