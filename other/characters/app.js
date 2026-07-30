"use strict";

const FILTERS = [
  { id: "all", label: "Mind" },
  { id: "newgen", label: "Newgen" },
  { id: "oldgen", label: "Oldgen" },
  { id: "retired", label: "Futottak még" }
];

const ERA_LABELS = {
  newgen: "Newgen · elmúlt 2 év",
  oldgen: "Oldgen · régi karakter",
  retired: "Futottak még · leadott"
};

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
  currentIndex: 0,
  detailOpen: false,
  wheelLocked: false
};

const elements = {
  app: document.querySelector("#constellationApp"),
  filterBar: document.querySelector("#filterBar"),
  visibleCount: document.querySelector("#visibleCount"),
  activeName: document.querySelector("#activeName"),
  orbitViewport: document.querySelector("#orbitViewport"),
  characterTrack: document.querySelector("#characterTrack"),
  previousButton: document.querySelector("#previousButton"),
  nextButton: document.querySelector("#nextButton"),
  detailLayer: document.querySelector("#detailLayer"),
  detailBackdrop: document.querySelector("#detailBackdrop"),
  detailCard: document.querySelector("#detailCard"),
  closeDetailButton: document.querySelector("#closeDetailButton"),
  characterImage: document.querySelector("#characterImage"),
  characterGeneration: document.querySelector("#characterGeneration"),
  characterGroup: document.querySelector("#characterGroup"),
  characterKicker: document.querySelector("#characterKicker"),
  characterName: document.querySelector("#characterName"),
  characterTagline: document.querySelector("#characterTagline"),
  characterSummary: document.querySelector("#characterSummary"),
  characterFacts: document.querySelector("#characterFacts"),
  characterLinks: document.querySelector("#characterLinks"),
  emptyState: document.querySelector("#emptyState")
};

initialize();

async function initialize() {
  bindEvents();

  try {
    const response = await fetch("characters.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new TypeError("A characters.json gyökéreleme tömb legyen.");

    state.allCharacters = data.filter(isValidCharacter);
    applyFilter("all", { initial: true });
  } catch (error) {
    console.error("A karakterlista nem tölthető be:", error);
    showLoadError();
  }
}

function bindEvents() {
  elements.previousButton.addEventListener("click", () => stepCharacter(-1));
  elements.nextButton.addEventListener("click", () => stepCharacter(1));
  elements.closeDetailButton.addEventListener("click", closeDetail);
  elements.detailBackdrop.addEventListener("click", closeDetail);

  document.addEventListener("keydown", (event) => {
    const interactive = event.target instanceof HTMLInputElement
      || event.target instanceof HTMLTextAreaElement
      || event.target instanceof HTMLSelectElement;

    if (interactive) return;

    if (event.key === "Escape" && state.detailOpen) {
      event.preventDefault();
      closeDetail();
      return;
    }

    if (["ArrowLeft", "a", "A"].includes(event.key)) {
      event.preventDefault();
      stepCharacter(-1);
    }

    if (["ArrowRight", "d", "D"].includes(event.key)) {
      event.preventDefault();
      stepCharacter(1);
    }

    if (event.key === "Enter" && !state.detailOpen && state.visibleCharacters.length) {
      event.preventDefault();
      openDetail();
    }
  });

  elements.orbitViewport.addEventListener("wheel", (event) => {
    if (state.visibleCharacters.length < 2 || state.wheelLocked || state.detailOpen) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 12) return;

    event.preventDefault();
    state.wheelLocked = true;
    stepCharacter(delta > 0 ? 1 : -1);
    window.setTimeout(() => { state.wheelLocked = false; }, 380);
  }, { passive: false });

  window.addEventListener("resize", () => {
    centerActiveOrb({ smooth: false });
    reportHeight();
  });
}

function isValidCharacter(character) {
  return character
    && typeof character === "object"
    && typeof character.name === "string"
    && character.name.trim().length > 0;
}

function applyFilter(filterId, { initial = false } = {}) {
  state.activeFilter = filterId;
  state.visibleCharacters = filterId === "all"
    ? [...state.allCharacters]
    : state.allCharacters.filter((character) => character.era === filterId);
  state.currentIndex = 0;

  closeDetail({ restoreFocus: false });
  renderFilters();
  renderCarousel();
  updateInterface();

  window.requestAnimationFrame(() => centerActiveOrb({ smooth: !initial }));
}

function renderFilters() {
  elements.filterBar.replaceChildren();

  FILTERS.forEach((filter) => {
    const count = filter.id === "all"
      ? state.allCharacters.length
      : state.allCharacters.filter((character) => character.era === filter.id).length;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${state.activeFilter === filter.id ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(state.activeFilter === filter.id));
    button.innerHTML = `${escapeHtml(filter.label)}<span class="filter-button__count">${count}</span>`;
    button.addEventListener("click", () => applyFilter(filter.id));
    elements.filterBar.appendChild(button);
  });
}

function renderCarousel() {
  elements.characterTrack.replaceChildren();

  state.visibleCharacters.forEach((character, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-orb";
    button.dataset.index = String(index);
    button.dataset.era = character.era || "retired";
    button.style.setProperty("--float-delay", `${-(index % 6) * 0.55}s`);
    button.setAttribute("aria-label", `${character.name} adatlapjának megnyitása`);

    const halo = document.createElement("span");
    halo.className = "character-orb__halo";

    const image = document.createElement("img");
    image.className = "character-orb__image";
    image.src = character.image || "images/placeholder-01.svg";
    image.alt = "";
    image.loading = index < 5 ? "eager" : "lazy";
    image.addEventListener("error", () => {
      image.src = "images/placeholder-01.svg";
    }, { once: true });

    const era = document.createElement("span");
    era.className = "character-orb__era";
    era.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "character-orb__name";
    name.textContent = character.name;

    halo.append(image, era);
    button.append(halo, name);
    button.addEventListener("click", () => {
      selectCharacter(index, { open: true });
    });

    elements.characterTrack.appendChild(button);
  });
}

function updateInterface() {
  const total = state.visibleCharacters.length;
  const hasCharacters = total > 0;

  elements.emptyState.hidden = hasCharacters;
  elements.orbitViewport.hidden = !hasCharacters;
  elements.previousButton.hidden = !hasCharacters;
  elements.nextButton.hidden = !hasCharacters;
  elements.visibleCount.textContent = hasCharacters
    ? `${String(state.currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
    : "00 / 00";

  if (!hasCharacters) {
    elements.activeName.textContent = "Nincs találat";
    reportHeight();
    return;
  }

  const character = state.visibleCharacters[state.currentIndex];
  elements.activeName.textContent = character.name;
  elements.previousButton.disabled = total < 2;
  elements.nextButton.disabled = total < 2;

  updateOrbStates();

  if (state.detailOpen) renderDetail(character);
  reportHeight();
}

function updateOrbStates() {
  const buttons = [...elements.characterTrack.querySelectorAll(".character-orb")];
  const total = buttons.length;

  buttons.forEach((button, index) => {
    const rawDistance = Math.abs(index - state.currentIndex);
    const wrappedDistance = total > 2 ? Math.min(rawDistance, total - rawDistance) : rawDistance;
    const isActive = index === state.currentIndex;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
    button.style.setProperty("--distance", String(Math.min(wrappedDistance, 4)));
  });
}

function selectCharacter(index, { open = false } = {}) {
  const total = state.visibleCharacters.length;
  if (!total) return;

  state.currentIndex = ((index % total) + total) % total;
  updateInterface();
  centerActiveOrb();

  if (open) openDetail();
}

function stepCharacter(direction) {
  if (state.visibleCharacters.length < 2) return;
  selectCharacter(state.currentIndex + direction);
}

function centerActiveOrb({ smooth = true } = {}) {
  const active = elements.characterTrack.querySelector(".character-orb.is-active");
  if (!active || elements.orbitViewport.hidden) return;

  const viewportRect = elements.orbitViewport.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const offsetFromCenter = (activeRect.left + activeRect.width / 2)
    - (viewportRect.left + viewportRect.width / 2);

  elements.orbitViewport.scrollTo({
    left: Math.max(0, elements.orbitViewport.scrollLeft + offsetFromCenter),
    behavior: smooth ? "smooth" : "auto"
  });
}

function openDetail() {
  const character = state.visibleCharacters[state.currentIndex];
  if (!character) return;

  state.detailOpen = true;
  renderDetail(character);
  elements.detailLayer.hidden = false;
  elements.detailLayer.setAttribute("aria-hidden", "false");
  elements.closeDetailButton.focus({ preventScroll: true });
  reportHeight();
}

function closeDetail({ restoreFocus = true } = {}) {
  if (!state.detailOpen && elements.detailLayer.hidden) return;

  state.detailOpen = false;
  elements.detailLayer.hidden = true;
  elements.detailLayer.setAttribute("aria-hidden", "true");

  if (restoreFocus) {
    elements.characterTrack.querySelector(".character-orb.is-active")?.focus({ preventScroll: true });
  }

  reportHeight();
}

function renderDetail(character) {
  elements.characterImage.src = character.image || "images/placeholder-01.svg";
  elements.characterImage.alt = `${character.name} portréja`;
  elements.characterImage.onerror = () => {
    elements.characterImage.onerror = null;
    elements.characterImage.src = "images/placeholder-01.svg";
  };

  elements.characterGeneration.textContent = ERA_LABELS[character.era] || character.era || "—";
  elements.characterGroup.textContent = character.group || "Nincs csoport";
  elements.characterKicker.textContent = character.kicker || "Karakteradatlap";
  elements.characterName.textContent = character.name;
  elements.characterTagline.textContent = character.tagline || "";
  elements.characterSummary.textContent = character.summary || "Ehhez a karakterhez még nincs rövid összefoglaló.";

  renderFacts(character.facts || {});
  renderLinks(character.links || {});
}

function renderFacts(facts) {
  elements.characterFacts.replaceChildren();

  Object.entries(facts).slice(0, 7).forEach(([label, value]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "fact";

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = String(value ?? "—");
    description.title = description.textContent;

    wrapper.append(term, description);
    elements.characterFacts.appendChild(wrapper);
  });
}

function renderLinks(links) {
  elements.characterLinks.replaceChildren();

  LINK_TYPES.forEach(({ key, label }) => {
    const url = typeof links[key] === "string" ? links[key].trim() : "";

    if (url) {
      const anchor = document.createElement("a");
      anchor.className = "character-link";
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = label;
      elements.characterLinks.appendChild(anchor);
      return;
    }

    const disabled = document.createElement("span");
    disabled.className = "character-link is-disabled";
    disabled.textContent = label;
    disabled.title = "Ehhez a karakterhez nincs megadva link.";
    elements.characterLinks.appendChild(disabled);
  });
}

function showLoadError() {
  state.visibleCharacters = [];
  elements.characterTrack.replaceChildren();
  elements.orbitViewport.hidden = true;
  elements.previousButton.hidden = true;
  elements.nextButton.hidden = true;
  elements.emptyState.hidden = false;
  elements.emptyState.querySelector("p").textContent = "A characters.json nem tölthető be.";
  elements.visibleCount.textContent = "HIBA";
  elements.activeName.textContent = "Ellenőrizd a fájl elérési útját";
  reportHeight();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function reportHeight() {
  window.requestAnimationFrame(() => {
    const height = Math.ceil(elements.app.getBoundingClientRect().height);
    window.parent?.postMessage?.({ type: "characterRoster:resize", height }, "*");
  });
}
