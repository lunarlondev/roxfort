// --- 1. ADATOK (Játékosok) ---
const SLY_COLOR = "#486400";
const RAV_COLOR = "#254586";

const mardekar = [
  { p: "Fogó", n: "Gemma Jenkins", l: "Jenkins", u: 5, t: 4, gy: 4, f: 3 },
  { p: "Őrző", n: "Heranoush Fletcher", l: "Fletcher", u: 4, t: 2, gy: 4, f: 3 },
  { p: "1. Terelő", n: "Nialen Travers", l: "Travers", u: 5, t: 3, gy: 4, f: 2 },
  { p: "2. Terelő", n: "Octavia Selwyn", l: "Selwyn", u: 3, t: 4, gy: 3, f: 4 },
  { p: "1. Hajtó", n: "Connor O'Hara", l: "O'Hara", u: 5, t: 5, gy: 4, f: 3 },
  { p: "2. Hajtó", n: "Elijah Shafiq", l: "Shafiq", u: 3, t: 3, gy: 5, f: 2 },
  { p: "3. Hajtó", n: "Blaze Florance", l: "Florance", u: 4, t: 2, gy: 4, f: 3 }
];

const hollohat = [
  { p: "Fogó", n: "Zafira Tavish", l: "Tavish", u: 5, t: 4, gy: 4, f: 4 },
  { p: "Őrző", n: "Elara Whitcombe", l: "Whitcombe", u: 4, t: 2, gy: 3, f: 3 },
  { p: "1. Terelő", n: "Robert McLagen", l: "McLagen", u: 4, t: 3, gy: 5, f: 2 },
  { p: "2. Terelő", n: "William Ashford", l: "Ashford", u: 3, t: 4, gy: 4, f: 3 },
  { p: "1. Hajtó", n: "Soffi Lowe", l: "Lowe", u: 0, t: 0, gy: 0, f: 0 },
  { p: "2. Hajtó", n: "Siddhartha Suduri", l: "Suduri", u: 4, t: 5, gy: 3, f: 4 },
  { p: "3. Hajtó", n: "Magnus Fairchild", l: "Fairchild", u: 3, t: 4, gy: 3, f: 5 }
];

// --- 2. MEGJELENÍTÉS (Renderelés) ---
function renderTeam(list, targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = list.map(player => `
    <div class="player-box">
      <span class="p-name">${player.p}: ${player.n}</span>
      <div class="stat-row">
        <div class="stat">Ügy: <span>${player.u}</span></div>
        <div class="stat">Tak: <span>${player.t}</span></div>
        <div class="stat">Gyo: <span>${player.gy}</span></div>
        <div class="stat">Fair: <span>${player.f}</span></div>
      </div>
    </div>
  `).join("");
}

function render() {
  renderTeam(mardekar, "slytherinPlayers");
  renderTeam(hollohat, "ravenclawPlayers");
}

// --- 3. BBCODE GENERÁLÁS (névkiemelés) ---
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightNames(text, team, color) {
  team.forEach(player => {
    let last = escapeRegExp(player.l);

    // O'Hara és O’Hara (tipográfiai aposztróf) kezelése
    last = last.replace("'", "['’]");

    const regex = new RegExp(`\\b${last}([a-záéíóöőúüű]*)\\b`, "gi");
    text = text.replace(regex, match => `[color=${color}][b]${match.toUpperCase()}[/b][/color]`);
  });
  return text;
}

function buildBbCode(text, rScore, sScore) {
  const r = String(rScore ?? "0");
  const s = String(sScore ?? "0");

  // Mardekár elöl, Hollóhát utána
  return `[box][justify]${text}[/justify]

[center][font=georgia][size=20pt][color=${SLY_COLOR}]${s}[/color] [color=#FFFFFF][b][i] - [/i][/b][/color] [color=${RAV_COLOR}]${r}[/color][/size][/font][/center][/box]`;
}

// --- 4. PONTÁLLÁS MENTÉSE / VISSZATÖLTÉSE ---
const ravenInput = document.getElementById("ravenclawScore");
const slyInput = document.getElementById("slytherinScore");

function saveScores() {
  localStorage.setItem("quidditchScore", JSON.stringify({
    ravenclaw: ravenInput.value,
    slytherin: slyInput.value
  }));
}

function loadScores() {
  const saved = localStorage.getItem("quidditchScore");
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.ravenclaw !== undefined) ravenInput.value = data.ravenclaw;
    if (data.slytherin !== undefined) slyInput.value = data.slytherin;
  } catch {}
}

// --- 5. UI ESEMÉNYEK ---
document.getElementById("generateBtn").addEventListener("click", () => {
  let text = document.getElementById("matchText").value;

  const rS = ravenInput.value;
  const sS = slyInput.value;

  text = highlightNames(text, mardekar, SLY_COLOR);
  text = highlightNames(text, hollohat, RAV_COLOR);

  document.getElementById("outputCode").value = buildBbCode(text, rS, sS);
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const out = document.getElementById("outputCode");
  const text = out.value || "";

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    out.focus();
    out.select();
    document.execCommand("copy");
  }

  const btn = document.getElementById("copyBtn");
  const original = btn.innerText;
  btn.innerText = "Másolva!";
  setTimeout(() => btn.innerText = original, 2000);
});

document.querySelectorAll(".score-control button").forEach(btn => {
  btn.addEventListener("click", () => {
    const team = btn.dataset.team;
    const dir = parseInt(btn.dataset.dir, 10);
    const input = team === "ravenclaw" ? ravenInput : slyInput;

    let val = parseInt(input.value || "0", 10);
    val += dir * 10;
    if (val < 0) val = 0;

    input.value = String(val);
    saveScores();
  });
});

ravenInput.addEventListener("change", saveScores);
slyInput.addEventListener("change", saveScores);

loadScores();
render();