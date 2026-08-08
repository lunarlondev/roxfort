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

const LINK_TYPES = [
  { key: "profile", label: "Profil" },
  { key: "history", label: "Előtörténet" },
  { key: "relations", label: "Kapcsolatok" },
  { key: "treasure", label: "Kincses" },
  { key: "games", label: "Játéklista" }
];

const state = {
  allCharacters: [],
  visibleCharacters: [],
  activeFilter: "all",
  selectedId: null,
  points: []
};

const elements = {
  app: document.querySelector("#constellationApp"),
  filterBar: document.querySelector("#filterBar"),
  visibleCount: document.querySelector("#visibleCount"),
  sky: document.querySelector("#constellationSky"),
  lines: document.querySelector("#constellationLines"),
  characterField: document.querySelector("#characterField"),
  emptyState: document.querySelector("#emptyState"),
  detailPlaceholder: document.querySelector("#detailPlaceholder"),
  detailCard: document.querySelector("#detailCard"),
  characterImage: document.querySelector("#characterImage"),
  characterName: document.querySelector("#characterName"),
  characterGroups: document.querySelector("#characterGroups"),
  characterLinks: document.querySelector("#characterLinks")
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

  return {
    id: String(character.id || index + 1),
    name: String(character.name || "Névtelen karakter").trim(),
    image: String(character.image || "images/placeholder-01.svg").trim(),
    groups: Array.isArray(character.groups)
      ? character.groups.map(String).map((value) => value.trim()).filter(Boolean)
      : [String(character.group || "").trim()].filter(Boolean),
    era: ["newgen", "oldgen", "retired"].includes(era) ? era : "newgen",
    stage: ["hogwarts", "higher", "adult"].includes(stage) ? stage : "adult",
    links: character.links && typeof character.links === "object"
      ? character.links
      : {}
  };
}

function applyFilter(filterId, { initial = false } = {}) {
  const filter = FILTERS.find((item) => item.id === filterId) || FILTERS[0];

  state.activeFilter = filter.id;
  state.selectedId = null;

  const matches = filter.type === "all"
    ? [...state.allCharacters]
    : state.allCharacters.filter((character) => character[filter.type] === filter.id);

  state.visibleCharacters = shuffle(matches);
  state.points = generateConstellationPoints(state.visibleCharacters.length);

  renderFilters();
  renderConstellation({ initial });
  clearDetail();
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
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-star";
    button.dataset.id = character.id;
    button.dataset.era = character.era;
    button.dataset.stage = character.stage;
    button.style.setProperty("--x", `${point.x}%`);
    button.style.setProperty("--y", `${point.y}%`);
    button.style.setProperty("--delay", `${-(Math.random() * 5).toFixed(2)}s`);
    button.style.setProperty("--duration", `${(4.8 + Math.random() * 2.8).toFixed(2)}s`);
    button.style.setProperty("--drift-x", `${(-3 + Math.random() * 6).toFixed(1)}px`);
    button.style.setProperty("--drift-y", `${(-3 + Math.random() * 6).toFixed(1)}px`);
    button.style.setProperty("--arrival-delay", `${initial ? 30 + index * 55 : index * 45}ms`);
    button.setAttribute("aria-label", character.name);

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
    button.append(halo, label);
    button.addEventListener("click", () => selectCharacter(character.id));

    elements.characterField.appendChild(button);
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

function selectCharacter(id) {
  const character = state.visibleCharacters.find((item) => item.id === id);
  if (!character) return;

  state.selectedId = id;

  [...elements.characterField.querySelectorAll(".character-star")].forEach((button) => {
    const isSelected = button.dataset.id === id;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  renderDetail(character);
}

function renderDetail(character) {
  elements.detailCard.classList.remove("is-entering");
  void elements.detailCard.offsetWidth;

  elements.characterImage.src = character.image;
  elements.characterImage.alt = character.name;
  elements.characterImage.onerror = () => {
    elements.characterImage.onerror = null;
    elements.characterImage.src = "images/placeholder-01.svg";
  };

  elements.characterName.textContent = character.name;
  renderGroups(character.groups);
  renderLinks(character.links);

  elements.detailPlaceholder.hidden = true;
  elements.detailCard.hidden = false;
  elements.detailCard.classList.add("is-entering");

  window.requestAnimationFrame(reportHeight);
}

function renderGroups(groups) {
  elements.characterGroups.replaceChildren();

  groups.forEach((group) => {
    const chip = document.createElement("span");
    chip.textContent = group;
    elements.characterGroups.appendChild(chip);
  });

  elements.characterGroups.hidden = groups.length === 0;
}

function renderLinks(links) {
  elements.characterLinks.replaceChildren();

  LINK_TYPES.forEach(({ key, label }) => {
    const url = typeof links?.[key] === "string" ? links[key].trim() : "";
    if (!url) return;

    const anchor = document.createElement("a");
    anchor.className = "character-link";
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = label;
    elements.characterLinks.appendChild(anchor);
  });

  elements.characterLinks.hidden = elements.characterLinks.childElementCount === 0;
}

function clearDetail() {
  elements.detailCard.hidden = true;
  elements.detailCard.classList.remove("is-entering");
  elements.detailPlaceholder.hidden = false;
}

function updateCount() {
  const total = state.visibleCharacters.length;
  elements.visibleCount.textContent = `${total} karakter`;
}

function generateConstellationPoints(count) {
  if (!count) return [];

  const points = [];
  const minDistance = Math.max(13, 25 - count * 1.35);
  const minX = 11;
  const maxX = 89;
  const minY = 13;
  const maxY = 87;

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
  clearDetail();
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
