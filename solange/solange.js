const PLACEHOLDER_IMAGE =
  "https://i.pinimg.com/1200x/5f/9e/e2/5f9ee2406ee9dfec3252630933e51b88.jpg";

const PERSPECTIVES = [
  { id: "solange", name: "Solange Laveau", priority: true },
  { id: "naya", name: "Naya Laveau", priority: true },
  { id: "jackson", name: "Jackson", priority: true },
  { id: "kigyo", name: "Kígyó", priority: true },
  { id: "elspeth", name: "Elspeth Mordrake" },
  { id: "nox", name: "Nathaniel Nox" },
  { id: "lucinda", name: "Lucinda Yaxley" }
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

const selector = document.getElementById("historySelector");
const transition = document.getElementById("historyTransition");
const transitionGif = document.getElementById("transitionGif");
const reader = document.getElementById("historyReader");
const readerTitle = document.getElementById("readerTitle");
const textbox = document.getElementById("historyTextbox");

const backBtn = document.getElementById("historyBackBtn");
const collapseBtn = document.getElementById("historyCollapseBtn");

let activeId = null;

function renderSelector() {
  selector.innerHTML = "";

  PERSPECTIVES.forEach((p, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "history-card";
    if (p.priority) card.classList.add("history-priority");

    const img = document.createElement("img");
    img.className = "hc-img";
    img.src = PLACEHOLDER_IMAGE;
    img.alt = "";

    const overlay = document.createElement("div");
    overlay.className = "history-overlay";

    const name = document.createElement("div");
    name.className = "history-name";
    name.textContent = p.name;

    overlay.appendChild(name);
    card.appendChild(img);
    card.appendChild(overlay);

    card.addEventListener("click", () => openPerspective(p.id, idx));
    selector.appendChild(card);
  });
}

async function loadTextFile(id) {
  try {
    const response = await fetch(`perspectives/${id}.txt`);
    if (!response.ok) throw new Error("Nem található a fájl.");
    return await response.text();
  } catch (err) {
    return "Hiba történt a szöveg betöltésekor.";
  }
}

async function openPerspective(id, idx) {
  activeId = id;

  transitionGif.src = GIFS[idx] || GIFS[0];
  transition.classList.remove("hidden");

  reader.classList.add("hidden");

  const title = PERSPECTIVES.find(x => x.id === id)?.name || "Nézőpont";
  readerTitle.textContent = title;

  const text = await loadTextFile(id);

  textbox.innerHTML = text;
  textbox.scrollTop = 0;

  reader.classList.remove("hidden");

  transition.scrollIntoView({ behavior: "smooth", block: "start" });
}

function collapse() {
  reader.classList.add("hidden");
  transition.classList.add("hidden");
  transitionGif.src = "";
  activeId = null;
}

function backToSelector() {
  collapse();
  selector.scrollIntoView({ behavior: "smooth", block: "start" });
}

collapseBtn.addEventListener("click", collapse);
backBtn.addEventListener("click", backToSelector);

renderSelector();