/* ==============================
   RANDOM STATE
================================ */

const randomBtn = document.getElementById("randomBtn");

let readSet = new Set();
let randomQueue = [];


/* ==============================
   PERSPECTIVES
================================ */

const PERSPECTIVES = [
  {
    id: "solange",
    name: "Solange Laveau",
    priority: true,
    image: "https://i.pinimg.com/736x/cb/ae/f9/cbaef9faaf1866e7917e8d887357404e.jpg"
  },
  {
    id: "naya",
    name: "Naya Laveau",
    priority: true,
    image: "https://i.pinimg.com/736x/be/13/fa/be13fa4baf492bdf9339d43b96dd4a14.jpg"
  },
  {
    id: "jackson",
    name: "Jackson",
    priority: true,
    image: "https://i.pinimg.com/736x/9f/84/aa/9f84aac0a469ef49180a5fe1d4a2e767.jpg"
  },
  {
    id: "kigyo",
    name: "Kígyó",
    priority: true,
    image: "https://i.pinimg.com/1200x/75/b8/00/75b8008b4a17a580d3045493ad956f97.jpg"
  },
  {
    id: "elspeth",
    name: "Elspeth Mordrake",
    image: "https://i.pinimg.com/1200x/5b/fc/45/5bfc45bcd561bface8fd919136dca3aa.jpg"
  },
  {
    id: "nox",
    name: "Nathaniel Nox",
    image: "https://i.pinimg.com/736x/b3/b5/4a/b3b54abe505d50380cb30b1358f47340.jpg"
  },
  {
    id: "lucinda",
    name: "Lucinda Yaxley",
    image: "https://i.pinimg.com/736x/09/22/5e/09225eceb1d59f633268d12c196784b9.jpg"
  }
];

const GIFS = [
  "https://i.pinimg.com/originals/ee/d1/f3/eed1f39f680461896717af4e7f40a2c3.gif",
  "https://i.pinimg.com/originals/7f/08/84/7f0884bb284ff2fdd6ab3dcdcdc3c897.gif",
  "https://i.pinimg.com/originals/18/30/65/183065c8ff5436ef9560dda6e161870e.gif",
  "https://i.pinimg.com/originals/c7/9c/0b/c79c0bf517f00fb273de863c9c1fc8d5.gif",
  "https://i.pinimg.com/originals/fc/4d/39/fc4d3904f730badf5ab103d12f5c2419.gif",
  "https://i.pinimg.com/originals/ba/e6/a8/bae6a89bfbd5feaf7e7917542d77c4b7.gif",
  "https://i.pinimg.com/originals/3b/04/6b/3b046bf6bda248af1b80b3f74366af3f.gif"
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

function getAvailablePerspectives() {

  const unlocked = [];

  const hasCore =
    readSet.has("solange") ||
    readSet.has("naya");

  PERSPECTIVES.forEach(p => {

    if (["elspeth", "nox", "lucinda"].includes(p.id) && !hasCore) {
      return;
    }

    if (!readSet.has(p.id)) {
      unlocked.push(p);
    }
  });

  return unlocked;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function handleRandom() {

  if (randomQueue.length === 0) {
    const available = getAvailablePerspectives();
    randomQueue = shuffleArray(available);
  }

  if (randomQueue.length === 0) return;

  const next = randomQueue.shift();
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


/* ==============================
   INIT
================================ */

collapseBtn.addEventListener("click", collapse);

if (randomBtn) {
  randomBtn.addEventListener("click", handleRandom);
}

renderSelector();


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