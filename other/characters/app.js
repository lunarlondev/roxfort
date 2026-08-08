"use strict";

const FILTERS = [
  { id: "all", label: "Mind", type: "all" },
  { id: "newgen", label: "Newgen", type: "era" },
  { id: "oldgen", label: "Oldgen", type: "era" },
  { id: "retired", label: "Futottak még", type: "era" },
  { id: "hogwarts", label: "Roxfortos diákok", type: "stage" },
  { id: "higher", label: "Felsőoktatásban tanulók", type: "stage" },
  { id: "adult", label: "Felnőtt karakterek", type: "stage" }
];

const state = {
  allCharacters: [],
  visibleCharacters: [],
  activeFilter: "all",
  points: []
};

const elements = {
  filterBar: document.querySelector("#filterBar"),
  visibleCount: document.querySelector("#visibleCount"),
  sky: document.querySelector("#constellationSky"),
  lines: document.querySelector("#constellationLines"),
  characterField: document.querySelector("#characterField"),
  emptyState: document.querySelector("#emptyState")
};

initialize();

async function initialize() {
  try {
    const response = await fetch("characters.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawData = await response.json();
    if (!Array.isArray(rawData)) {
      throw new TypeError("A characters.json gyökéreleme tömb legyen.");
    }

    state.allCharacters = rawData
      .filter(isValidCharacter)
      .map(normalizeCharacter);

    applyFilter("all", { initial: true });
  } catch (error) {
    console.error("A karakterlista nem tölthető be:", error);
    showLoadError();
  }

  window.addEventListener("resize", reportHeight);
}

function isValidCharacter(character) {
  return Boolean(
    character
    && typeof character === "object"
    && typeof character.name === "string"
    && character.name.trim()
  );
}

function normalizeCharacter(character, index) {
  const era = String(character.era || "newgen").trim().toLowerCase();
  const stage = String(character.stage || "adult").trim().toLowerCase();
  const profile = typeof character.links?.profile === "string"
    ? character.links.profile.trim()
    : "";

  return {
    id: String(character.id || index + 1),
    name: String(character.name || "Névtelen karakter").trim(),
    image: String(character.image || "images/placeholder-01.svg").trim(),
    groups: Array.isArray(character.groups)
      ? character.groups.map(String).map((value) => value.trim()).filter(Boolean)
      : [],
    era: ["newgen", "oldgen", "retired"].includes(era) ? era : "newgen",
    stage: ["hogwarts", "higher", "adult"].includes(stage) ? stage : "adult",
    profile
  };
}

function applyFilter(filterId, { initial = false } = {}) {
  const filter = FILTERS.find((item) => item.id === filterId) || FILTERS[0];

  state.activeFilter = filter.id;

  const matches = filter.type === "all"
    ? [...state.allCharacters]
    : state.allCharacters.filter((character) => character[filter.type] === filter.id);

  state.visibleCharacters = shuffle(matches);
  state.points = generateConstellationPoints(state.visibleCharacters.length);

  renderFilters();
  renderConstellation({ initial });
  updateCount();

  window.requestAnimationFrame(reportHeight);
}

function renderFilters() {
  elements.filterBar.replaceChildren();

  FILTERS.forEach((filter, index) => {
    if (index === 4) {
      const divider = document.createElement("span");
      divider.className = "filters__divider";
      divider.setAttribute("aria-hidden", "true");
      elements.filterBar.appendChild(divider);
    }

    const count = filter.type === "all"
      ? state.allCharacters.length
      : state.allCharacters.filter((character) => character[filter.type] === filter.id).length;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${state.activeFilter === filter.id ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(state.activeFilter === filter.id));
    button.dataset.filter = filter.id;

    const text = document.createElement("span");
    text.textContent = filter.label;

    const countSpan = document.createElement("small");
    countSpan.textContent = String(count);

    button.append(text, countSpan);
    button.addEventListener("click", () => applyFilter(filter.id));
    elements.filterBar.appendChild(button);
  });
}

function renderConstellation({ initial = false } = {}) {
  elements.characterField.replaceChildren();
  elements.lines.replaceChildren();

  const hasCharacters = state.visibleCharacters.length > 0;
  elements.emptyState.hidden = hasCharacters;

  if (!hasCharacters) {
    elements.sky.classList.add("is-empty");
    return;
  }

  elements.sky.classList.remove("is-empty");

  state.visibleCharacters.forEach((character, index) => {
    const point = state.points[index];
    const star = character.profile
      ? document.createElement("a")
      : document.createElement("span");

    star.className = `character-star${character.profile ? "" : " is-disabled"}`;
    star.dataset.id = character.id;
    star.dataset.era = character.era;
    star.dataset.stage = character.stage;
    star.dataset.tooltipSide = point.x > 62 ? "left" : "right";
    star.style.setProperty("--x", `${point.x}%`);
    star.style.setProperty("--y", `${point.y}%`);
    star.style.setProperty("--delay", `${-(Math.random() * 5).toFixed(2)}s`);
    star.style.setProperty("--duration", `${(4.8 + Math.random() * 2.8).toFixed(2)}s`);
    star.style.setProperty("--drift-x", `${(-3 + Math.random() * 6).toFixed(1)}px`);
    star.style.setProperty("--drift-y", `${(-3 + Math.random() * 6).toFixed(1)}px`);
    star.style.setProperty("--arrival-delay", `${initial ? 30 + index * 55 : index * 45}ms`);

    if (character.profile) {
      star.href = character.profile;
      star.target = "_blank";
      star.rel = "noopener noreferrer";
      star.setAttribute("aria-label", `${character.name} profiljának megnyitása új lapon`);
    } else {
      star.setAttribute("aria-label", `${character.name} – nincs profil-link megadva`);
      star.setAttribute("aria-disabled", "true");
    }

    const halo = document.createElement("span");
    halo.className = "character-star__halo";

    const image = document.createElement("img");
    image.src = character.image;
    image.alt = "";
    image.loading = index < 6 ? "eager" : "lazy";
    image.addEventListener("error", () => {
      image.src = "images/placeholder-01.svg";
    }, { once: true });

    const label = document.createElement("span");
    label.className = "character-star__name";
    label.textContent = character.name;

    halo.appendChild(image);
    star.append(halo, label);

    if (character.groups.length) {
      const tooltip = document.createElement("span");
      tooltip.className = "character-star__tooltip";
      tooltip.setAttribute("role", "tooltip");

      character.groups.forEach((group) => {
        const item = document.createElement("span");
        item.className = "character-star__tooltip-item";
        item.textContent = group;
        tooltip.appendChild(item);
      });

      star.appendChild(tooltip);
    }

    elements.characterField.appendChild(star);
  });

  renderLines();
}

function renderLines() {
  if (state.points.length < 2) return;

  const connections = buildConnections(state.points);

  connections.forEach(([fromIndex, toIndex], index) => {
    const from = state.points[fromIndex];
    const to = state.points[toIndex];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);
    line.style.setProperty("--line-delay", `${index * 55}ms`);
    elements.lines.appendChild(line);
  });
}

function buildConnections(points) {
  const edges = new Set();

  points.forEach((point, index) => {
    const neighbors = points
      .map((other, otherIndex) => ({
        index: otherIndex,
        distance: otherIndex === index ? Infinity : distance(point, other)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, points.length < 5 ? 1 : 2);

    neighbors.forEach((neighbor) => {
      const a = Math.min(index, neighbor.index);
      const b = Math.max(index, neighbor.index);
      edges.add(`${a}:${b}`);
    });
  });

  return [...edges].map((edge) => edge.split(":").map(Number));
}

function updateCount() {
  elements.visibleCount.textContent = `${state.visibleCharacters.length} karakter`;
}

function generateConstellationPoints(count) {
  if (!count) return [];

  const points = [];
  const minDistance = Math.max(13, 25 - count * 1.35);
  const minX = 11;
  const maxX = 89;
  const minY = 14;
  const maxY = 86;

  for (let index = 0; index < count; index += 1) {
    let candidate = null;
    let attempts = 0;

    while (attempts < 180) {
      const next = {
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY)
      };

      const isFarEnough = points.every((point) => distance(point, next) >= minDistance);
      if (isFarEnough) {
        candidate = next;
        break;
      }
      attempts += 1;
    }

    if (!candidate) {
      const angle = (Math.PI * 2 * index) / Math.max(count, 1) + Math.random() * 0.45;
      const radiusX = 28 + Math.random() * 7;
      const radiusY = 25 + Math.random() * 8;
      candidate = {
        x: 50 + Math.cos(angle) * radiusX,
        y: 50 + Math.sin(angle) * radiusY
      };
    }

    points.push(candidate);
  }

  return points;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function showLoadError() {
  state.allCharacters = [];
  state.visibleCharacters = [];
  state.points = [];

  renderFilters();
  renderConstellation();
  updateCount();

  const message = elements.emptyState.querySelector("p");
  if (message) {
    message.textContent = "A characters.json fájl nem tölthető be vagy hibás.";
  }
  elements.emptyState.hidden = false;
  reportHeight();
}

function reportHeight() {
  window.requestAnimationFrame(() => {
    const height = Math.ceil(document.documentElement.scrollHeight);
    window.parent?.postMessage({
      type: "character-roster-height",
      height
    }, "*");
  });
}
