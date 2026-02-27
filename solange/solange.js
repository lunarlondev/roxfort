/* ==============================
   RANDOM STATE
================================ */

const randomBtn = document.getElementById("randomBtn");

let readSet = new Set();


/* ==============================
   PERSPECTIVES
================================ */

const PERSPECTIVES = [
  {
    id: "solange",
    name: "Solange Laveau",
    priority: true,
    image: "images/solange.jpg"
  },
  {
    id: "naya",
    name: "Naya Laveau",
    priority: true,
    image: "images/naya.jpg"
  },
  {
    id: "jackson",
    name: "Jackson",
    priority: true,
    image: "images/jackson.jpg"
  },
  {
    id: "damballah",
    name: "Damballah",
    priority: true,
    image: "images/damballah.jpg"
  },
  {
    id: "elspeth",
    name: "Elspeth Mordrake",
    image: "images/elspeth.jpg"
  },
  {
    id: "nox",
    name: "Nathaniel Nox",
    image: "images/nathaniel.jpg"
  },
  {
    id: "lucinda",
    name: "Lucinda Yaxley",
    image: "images/lucinda.jpg"
  }
];

const GIFS = [
  "images/gif/anim1.gif",
  "images/gif/anim2.gif",
  "images/gif/anim3.gif",
  "images/gif/anim4.gif",
  "images/gif/anim5.gif",
  "images/gif/anim6.gif",
  "images/gif/anim7.gif",
];


/* ==============================
   DOM REFERENCES
================================ */

const selector = document.getElementById("historySelector");
const transition = document.getElementById("historyTransition");
const transitionGif = document.getElementById("transitionGif");
const reader = document.getElementById("historyReader");
const readerTitle = document.getElementById("readerTitle");
const textbox = document.getElementById("historyTextbox");
const collapseBtn = document.getElementById("historyCollapseBtn");
const resetReadBtn = document.getElementById("resetReadBtn");

let activeId = null;


/* ==============================
   SELECTOR RENDER
================================ */

function renderSelector() {

  selector.innerHTML = "";

  const mainWrap = document.createElement("div");
  mainWrap.className = "history-main";

  const sideWrap = document.createElement("div");
  sideWrap.className = "history-side";

  PERSPECTIVES.forEach((p, idx) => {

    const card = document.createElement("button");
    card.type = "button";
    card.className = "history-card";

    if (p.priority) card.classList.add("history-priority");
    else card.classList.add("small");

    const img = document.createElement("img");
    img.className = "hc-img";
    img.src = p.image;
    img.alt = "";

    const overlay = document.createElement("div");
    overlay.className = "history-overlay";

    const name = document.createElement("div");
    name.className = "history-name";
    name.textContent = p.name;
    name.setAttribute("data-text", p.name);

    overlay.appendChild(name);
    card.appendChild(img);
    card.appendChild(overlay);

    card.addEventListener("click", () => openPerspective(p.id, idx));

    if (p.priority) mainWrap.appendChild(card);
    else sideWrap.appendChild(card);
  });

  selector.appendChild(mainWrap);
  selector.appendChild(sideWrap);


}


/* ==============================
   RANDOM LOGIC
================================ */



function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function handleRandom() {

  const hasCore =
    readSet.has("solange") ||
    readSet.has("naya");

  let pool = PERSPECTIVES.filter(p => {

    if (["elspeth","nox","lucinda"].includes(p.id) && !hasCore) {
      return false;
    }

    if (readSet.has(p.id)) {
      return false;
    }

    return true;
  });

  if (pool.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const next = pool[randomIndex];
  const index = PERSPECTIVES.findIndex(p => p.id === next.id);

  openPerspective(next.id, index);
}

/* ==============================
   FILE LOAD
================================ */

async function loadTextFile(id) {
  try {
    const response = await fetch(`perspectives/${id}.txt`);
    if (!response.ok) throw new Error();
    return await response.text();
  } catch {
    return "Hiba történt a szöveg betöltésekor.";
  }
}


/* ==============================
   OPEN / CLOSE
================================ */

async function openPerspective(id, idx) {

  activeId = id;

  transitionGif.src = GIFS[idx] || GIFS[0];
  transition.classList.remove("hidden");

  reader.classList.add("hidden");

  const title =
    PERSPECTIVES.find(x => x.id === id)?.name || "Nézőpont";

  readerTitle.textContent = title;

  const text = await loadTextFile(id);

  textbox.innerHTML = text;
  textbox.scrollTop = 0;

  readSet.add(id);

const cards = document.querySelectorAll(".history-card");
if (cards[idx]) {
  cards[idx].classList.add("read");
}


  reader.classList.remove("hidden");

  transition.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function collapse() {
  reader.classList.add("hidden");
  transition.classList.add("hidden");
  transitionGif.src = "";
  activeId = null;
}

function resetReadState() {

  // töröljük a Set-et
  readSet.clear();

  // levesszük a read class-t minden portréról
  document.querySelectorAll(".history-card").forEach(card => {
    card.classList.remove("read");
  });

}


/* ==============================
   INIT
================================ */

collapseBtn.addEventListener("click", collapse);

if (randomBtn) {
  randomBtn.addEventListener("click", handleRandom);
}

renderSelector();


if (resetReadBtn) {
  resetReadBtn.addEventListener("click", resetReadState);
}

/* ==============================
   RBF COLORING
================================ */

document.querySelectorAll(".grade").forEach(g => {

  const val = g.textContent.trim();
  const parent = g.closest(".rbf-item");

  if (val === "K") parent.classList.add("grade-k");
  if (val === "V") parent.classList.add("grade-v");
  if (val === "E") parent.classList.add("grade-e");
  if (val === "H") parent.classList.add("grade-h");

  g.style.display = "none";
});


document.querySelectorAll(".rbf-item").forEach(item => {

  const gradeEl = item.querySelector(".grade");
  if (!gradeEl) return;

  const val = gradeEl.textContent.trim();

  let fullText = "";

  if (val === "K") fullText = "Kiváló";
  if (val === "V") fullText = "Várakozáson felüli";
  if (val === "E") fullText = "Elfogadható";
  if (val === "H") fullText = "Hitvány";

  item.setAttribute("data-grade-label", fullText);
});