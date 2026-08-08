"use strict";

const FILTER_ROWS = [
  {
    type: "era",
    label: "Generáció",
    options: [
      { id: "all", label: "Mind" },
      { id: "oldgen", label: "Oldgen" },
      { id: "newgen", label: "Newgen" },
      { id: "retired", label: "Futottak még" }
    ]
  },
  {
    type: "stage",
    label: "Tanulmányok",
    options: [
      { id: "student", label: "Diákok" },
      { id: "higher", label: "Egyetemisták" },
      { id: "adult", label: "Egyéb" }
    ]
  },
  {
    type: "school",
    label: "Iskola",
    options: [
      { id: "hogwarts", label: "Roxfort" },
      { id: "ilvermorny", label: "Ilvermorny" },
      { id: "beauxbatons", label: "Beauxbatons" },
      { id: "other", label: "Egyéb" }
    ]
  },
  {
    type: "house",
    label: "Roxforti ház",
    options: [
      { id: "gryffindor", label: "Griffendél" },
      { id: "ravenclaw", label: "Hollóhát" },
      { id: "hufflepuff", label: "Hugrabug" },
      { id: "slytherin", label: "Mardekár" }
    ]
  },
  {
    type: "gender",
    label: "Nem",
    options: [
      { id: "male", label: "Férfi" },
      { id: "female", label: "Nő" },
      { id: "other", label: "Egyéb" }
    ]
  }
];

const state = {
  allCharacters: [],
  visibleCharacters: [],
  activeFilters: {
    era: "newgen",
    stage: null,
    school: null,
    house: null,
    gender: null
  },
  points: []
};

const elements = {
  filterBar: document.querySelector("#filterBar"),
  visibleCount: document.querySelector("#visibleCount"),
  sky: document.querySelector("#constellationSky"),
  spaceCanvas: document.querySelector("#spaceCanvas"),
  lines: document.querySelector("#constellationLines"),
  characterField: document.querySelector("#characterField"),
  emptyState: document.querySelector("#emptyState")
};

initialize();

async function initialize() {
  initializeSpaceBackground();

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

    applyFilters({ initial: true });
  } catch (error) {
    console.error("A karakterlista nem tölthető be:", error);
    showLoadError();
  }

  window.addEventListener("resize", reportHeight);
}

function initializeSpaceBackground() {
  const canvas = elements.spaceCanvas;
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const field = {
    width: 0,
    height: 0,
    dpr: 1,
    stars: [],
    frame: 0,
    previousTime: performance.now()
  };

  function signedRandom() {
    return Math.random() - Math.random();
  }

  function createStars() {
    const area = field.width * field.height;
    const count = Math.max(135, Math.min(205, Math.round(area / 1150)));

    field.stars = Array.from({ length: count }, () => ({
      x: signedRandom() * 4.25,
      y: signedRandom() * 3.45,
      z: signedRandom() * 2.45,
      size: 0.55 + Math.random() * 1.2,
      warmth: Math.random(),
      phase: Math.random() * Math.PI * 2
    }));
  }

  function resizeCanvas() {
    const rect = elements.sky.getBoundingClientRect();
    field.width = Math.max(1, rect.width);
    field.height = Math.max(1, rect.height);
    field.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(field.width * field.dpr);
    canvas.height = Math.round(field.height * field.dpr);
    canvas.style.width = `${field.width}px`;
    canvas.style.height = `${field.height}px`;
    context.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
    createStars();
    drawSpace(performance.now(), true);
  }

  function rotateStar(star, angleX, angleY) {
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const x = star.x * cosY - star.z * sinY;
    const z = star.x * sinY + star.z * cosY;
    star.x = x;
    star.z = z;

    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const y = star.y * cosX - star.z * sinX;
    const nextZ = star.y * sinX + star.z * cosX;
    star.y = y;
    star.z = nextZ;
  }

  function drawSpace(now, staticFrame = false) {
    const elapsed = Math.min(34, Math.max(0, now - field.previousTime));
    field.previousTime = now;

    context.clearRect(0, 0, field.width, field.height);

    const animate = !reducedMotion.matches && !staticFrame;
    const turnY = animate ? elapsed * 0.000075 : 0;
    const turnX = animate ? Math.sin(now * 0.00016) * elapsed * 0.0000065 : 0;
    const focal = Math.min(field.width, field.height) * 0.92;
    const cameraDistance = 5.55;
    const centerX = field.width / 2;
    const centerY = field.height / 2;

    const projected = [];

    field.stars.forEach((star) => {
      if (animate) rotateStar(star, turnX, turnY);

      const depth = star.z + cameraDistance;
      if (depth <= 0.55) return;

      const scale = focal / depth;
      const x = centerX + star.x * scale;
      const y = centerY + star.y * scale;

      if (x < -20 || x > field.width + 20 || y < -20 || y > field.height + 20) return;

      const nearness = Math.max(0, Math.min(1, (cameraDistance + 2.45 - depth) / 4.9));
      projected.push({ star, x, y, nearness });
    });

    projected.sort((a, b) => a.nearness - b.nearness);

    projected.forEach(({ star, x, y, nearness }) => {
      const twinkle = reducedMotion.matches ? 1 : 0.88 + Math.sin(now * 0.0012 + star.phase) * 0.12;

      // A canvas szélén kifutó fényudvar különben keskeny, világos
      // csíkként tud megjelenni. Az utolsó 30 px-ben finoman elhalványítjuk.
      const edgeDistance = Math.min(x, field.width - x, y, field.height - y);
      const edgeFade = Math.max(0, Math.min(1, edgeDistance / 30));
      if (edgeFade <= 0) return;

      const alpha = (0.14 + nearness * 0.68) * twinkle * edgeFade;
      const radius = 0.42 + star.size * (0.42 + nearness * 0.72);
      const wineStar = star.warmth > 0.93;
      const red = wineStar ? 190 : 220;
      const green = wineStar ? 132 : 231;
      const blue = wineStar ? 151 : 233;

      if (nearness > 0.72) {
        context.beginPath();
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha * 0.13})`;
        context.arc(x, y, radius * 3.3, 0, Math.PI * 2);
        context.fill();
      }

      context.beginPath();
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  function loop(now) {
    drawSpace(now);
    field.frame = window.requestAnimationFrame(loop);
  }

  const observer = typeof ResizeObserver === "function"
    ? new ResizeObserver(resizeCanvas)
    : null;

  observer?.observe(elements.sky);
  if (!observer) window.addEventListener("resize", resizeCanvas);

  reducedMotion.addEventListener?.("change", () => {
    field.previousTime = performance.now();
    drawSpace(field.previousTime, true);
  });

  resizeCanvas();
  field.frame = window.requestAnimationFrame(loop);
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
  const rawStage = String(character.stage || "adult").trim().toLowerCase();
  const stage = rawStage === "hogwarts" ? "student" : rawStage;
  const gender = String(character.gender || "other").trim().toLowerCase();
  const profile = typeof character.links?.profile === "string"
    ? character.links.profile.trim()
    : "";

  return {
    id: String(character.id || index + 1),
    name: String(character.name || "Névtelen karakter").trim(),
    image: String(character.image || "images/placeholder-01.svg").trim(),
    groups: normalizeList(character.groups),
    era: ["newgen", "oldgen", "retired"].includes(era) ? era : "newgen",
    stage: ["student", "higher", "adult"].includes(stage) ? stage : "adult",
    schools: normalizeAllowedList(character.schools, ["hogwarts", "ilvermorny", "beauxbatons", "other"]),
    houses: normalizeAllowedList(character.houses, ["gryffindor", "ravenclaw", "hufflepuff", "slytherin"]),
    gender: ["male", "female", "other"].includes(gender) ? gender : "other",
    profile
  };
}

function normalizeList(value) {
  return Array.isArray(value)
    ? value.map(String).map((item) => item.trim()).filter(Boolean)
    : [];
}

function normalizeAllowedList(value, allowed) {
  return normalizeList(value)
    .map((item) => item.toLowerCase())
    .filter((item) => allowed.includes(item));
}

function applyFilter(type, filterId) {
  if (!(type in state.activeFilters)) return;

  if (type === "era" && filterId === "all") {
    state.activeFilters.era = null;
  } else {
    state.activeFilters[type] = state.activeFilters[type] === filterId
      ? null
      : filterId;
  }

  applyFilters();
}

function applyFilters({ initial = false } = {}) {
  const matches = state.allCharacters.filter((character) => characterMatches(character));

  state.visibleCharacters = shuffle(matches);
  state.points = generateConstellationPoints(state.visibleCharacters.length);

  renderFilters();
  renderConstellation({ initial });
  updateCount();

  window.requestAnimationFrame(reportHeight);
}

function characterMatches(character, filters = state.activeFilters) {
  if (filters.era && character.era !== filters.era) return false;
  if (filters.stage && character.stage !== filters.stage) return false;
  if (filters.school && !character.schools.includes(filters.school)) return false;
  if (filters.house && !character.houses.includes(filters.house)) return false;
  if (filters.gender && character.gender !== filters.gender) return false;
  return true;
}

function renderFilters() {
  elements.filterBar.replaceChildren();

  FILTER_ROWS.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = `filters__row filters__row--${row.type}`;
    rowElement.setAttribute("role", "group");
    rowElement.setAttribute("aria-label", row.label);

    const rowLabel = document.createElement("span");
    rowLabel.className = "filters__row-label";
    rowLabel.textContent = row.label;
    rowLabel.setAttribute("aria-hidden", "true");

    const rowOptions = document.createElement("span");
    rowOptions.className = "filters__row-options";

    row.options.forEach((filter) => {
      const isAll = row.type === "era" && filter.id === "all";
      const isActive = isAll
        ? !state.activeFilters.era
        : state.activeFilters[row.type] === filter.id;

      const count = countForFacet(row.type, filter.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-button${isActive ? " is-active" : ""}`;
      button.setAttribute("aria-pressed", String(isActive));
      button.dataset.filterType = row.type;
      button.dataset.filter = filter.id;

      const text = document.createElement("span");
      text.textContent = filter.label;

      const countSpan = document.createElement("small");
      countSpan.textContent = String(count);

      button.append(text, countSpan);
      button.addEventListener("click", () => applyFilter(row.type, filter.id));
      rowOptions.appendChild(button);
    });

    rowElement.append(rowLabel, rowOptions);
    elements.filterBar.appendChild(rowElement);
  });
}

function countForFacet(type, filterId) {
  const filters = { ...state.activeFilters };

  if (type === "era" && filterId === "all") {
    filters.era = null;
  } else {
    filters[type] = filterId;
  }

  return state.allCharacters.filter((character) => characterMatches(character, filters)).length;
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
    star.dataset.index = String(index);
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
    star.style.setProperty("--portrait-size", `${(46 + Math.random() * 8).toFixed(1)}px`);

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

    const orbit = document.createElement("span");
    orbit.className = "character-star__orbit";
    orbit.setAttribute("aria-hidden", "true");

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

    halo.append(orbit, image);
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

    star.addEventListener("pointerenter", () => highlightConnections(index));
    star.addEventListener("pointerleave", clearConnectionHighlight);
    star.addEventListener("focus", () => highlightConnections(index));
    star.addEventListener("blur", clearConnectionHighlight);

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
    line.dataset.from = String(fromIndex);
    line.dataset.to = String(toIndex);
    line.style.setProperty("--line-delay", `${120 + index * 55}ms`);
    line.style.setProperty("--line-opacity", `${(0.28 + Math.random() * 0.18).toFixed(2)}`);
    elements.lines.appendChild(line);
  });
}

function highlightConnections(characterIndex) {
  elements.sky.classList.add("is-connection-highlighted");

  elements.lines.querySelectorAll("line").forEach((line) => {
    const isConnected = Number(line.dataset.from) === characterIndex
      || Number(line.dataset.to) === characterIndex;
    line.classList.toggle("is-active", isConnected);
  });
}

function clearConnectionHighlight() {
  elements.sky.classList.remove("is-connection-highlighted");
  elements.lines.querySelectorAll("line.is-active").forEach((line) => {
    line.classList.remove("is-active");
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

  const width = Math.max(elements.sky.clientWidth, 320);
  const height = Math.max(elements.sky.clientHeight, 390);
  const edgeX = 47;
  const edgeY = 44;
  const targetDistance = count <= 6 ? 104 : count <= 10 ? 92 : count <= 14 ? 82 : 74;
  const points = [];

  for (let index = 0; index < count; index += 1) {
    let bestCandidate = null;
    let bestNearestDistance = -1;

    for (let attempt = 0; attempt < 420; attempt += 1) {
      const xPx = edgeX + Math.random() * Math.max(1, width - edgeX * 2);
      const yPx = edgeY + Math.random() * Math.max(1, height - edgeY * 2);
      const candidate = {
        x: (xPx / width) * 100,
        y: (yPx / height) * 100
      };

      const nearestDistance = points.length
        ? Math.min(...points.map((point) => pixelDistance(point, candidate, width, height)))
        : Infinity;

      if (nearestDistance > bestNearestDistance) {
        bestCandidate = candidate;
        bestNearestDistance = nearestDistance;
      }

      if (nearestDistance >= targetDistance) break;
    }

    points.push(bestCandidate || { x: 50, y: 50 });
  }

  return points;
}

function pixelDistance(a, b, width, height) {
  const dx = ((a.x - b.x) / 100) * width;
  const dy = ((a.y - b.y) / 100) * height;
  return Math.hypot(dx, dy);
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
