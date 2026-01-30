const data = {
  origin: {
    label: "",
    img: "https://i.imgur.com/lg5UmXY.png",
    quote: ""
  },
  friends: {
    label: "Barátok",
    img: "https://i.imgur.com/7GvMPXA.png",
    quote: "Some friends arrive like prophecies."
  },
  lovers: {
    label: "Szerelmek",
    img: "https://i.imgur.com/SN1Eg2E.png",
    quote: "You shall have no other gods before me."
  },
  enemies: {
    label: "Ellenségek",
    img: "https://i.imgur.com/RoUZR9p.png",
    quote: "Your modern gods mean nothing in this part of the woods."
  }
};

const crosses = document.querySelectorAll(".cross-box");
const image = document.getElementById("image");
const quote = document.getElementById("quote");
const category = document.getElementById("category");

const titleInput = document.getElementById("titleInput");
const msgInput = document.getElementById("msgInput");
const out = document.getElementById("out");

let active = "origin";

/* --------- KÉP + SZÖVEG BETÖLTÉS --------- */
function load(type) {
  image.classList.remove("active");

  setTimeout(() => {
    image.style.backgroundImage = `url(${data[type].img})`;

    category.textContent = data[type].label || "";

    quote.innerHTML = data[type].quote
      ? data[type].quote
          .split(" ")
          .map(w => `<span>${w}</span>`)
          .join(" ")
      : "";

    image.classList.add("active");
  }, 200);
}

/* --------- MENÜKATTINTÁS --------- */
crosses.forEach(cross => {
  cross.addEventListener("click", () => {
    crosses.forEach(c => c.classList.remove("active"));
    cross.classList.add("active");

    active = cross.dataset.type;
    load(active);
  });
});

/* --------- ALAPÉRTELMEZETT ÁLLAPOT --------- */
load("origin");

/* --------- GENERÁLÁS --------- */
document.getElementById("genBtn").addEventListener("click", () => {
  const title = titleInput.value.trim();
  const msg = msgInput.value.replace(/\n/g, "<br>");

  const hasTitle = title !== "";

  out.value =
`[center][html]
<div style="max-width:320px;padding:16px;background:linear-gradient(180deg,#0e0e0e,#050505);border:1px solid #2a2a2a;box-shadow:0 0 0 1px #000 inset;color:#eee;font-family:Georgia,serif">
<style>
@import url('https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap');

.c{font-size:12px;line-height:1.65;text-align:justify}
.c .head{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.c .x{width:14px;height:34px;position:relative}
.c .x:before,.c .x:after{content:"";position:absolute;background:#f6f0d8}
.c .x:before{width:3px;height:34px;left:5px;top:0;box-shadow:0 0 10px rgba(246,240,216,.9)}
.c .x:after{width:14px;height:3px;left:0;top:12px}
.c h3{
  margin:0;
  font-size:16px;
  letter-spacing:2px;
  text-transform:uppercase;
  color:#f6f0d8;
  text-shadow:0 0 6px rgba(246,240,216,.4)
}
.c .body{
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.08);
}
.c .body:first-letter{
  font-family:'UnifrakturCook',Georgia,serif;
  font-size:48px;
  line-height:1;
  padding-right:4px;
  float:left;
  color:#f6f0d8;
  text-shadow:0 0 6px rgba(246,240,216,.6);
}

</style>
<div class="c">
  ${
    hasTitle
      ? `<div class="head">
           <div class="x"></div>
           <h3>${title}</h3>
         </div>`
      : `<div class="x" style="margin-bottom:8px"></div>`
  }
  <div class="body">${msg}</div>
</div>
</div>
[/html][/center]`;
});
