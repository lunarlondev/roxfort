"use strict";

(function () {
  const root = document.getElementById("viannetracker");

  if (!root) {
    return;
  }

  const state = {
    data: null,
    status: "all",
    search: "",
    character: null
  };

  const refs = {
    portrait: root.querySelector("[data-profile-portrait]"),
    brand: root.querySelector("[data-profile-brand]"),
    traits: root.querySelector("[data-profile-traits]"),
    filters: root.querySelector("[data-status-filters]"),
    timeline: root.querySelector("[data-timeline]"),
    search: root.querySelector("[data-search]"),
    clear: root.querySelector("[data-clear]"),
    selected: root.querySelector("[data-selected-character]"),
    selectedImage: root.querySelector("[data-selected-image]"),
    selectedName: root.querySelector("[data-selected-name]"),
    selectedCount: root.querySelector("[data-selected-count]")
  };

  const source = root.dataset.source || "viannetracker-data.json";

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      const response = await fetch(source, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni az adatfájlt.");
      }

      state.data = await response.json();
      renderStaticParts();
      bindEvents();
      render();
    } catch (error) {
      refs.timeline.innerHTML = '<div class="vi-error">Nem sikerült betölteni a viannetracker-data.json fájlt. Helyi tesztnél indítsd szerverről, ne sima file megnyitással.</div>';
    }
  }

  function renderStaticParts() {
    renderPortrait();
    renderBrand();
    renderTraits();
    renderFilters();
  }

  function renderPortrait() {
    const img = document.createElement("img");
    img.alt = "Vianne M. Gardner";
    setSmartImage(img, state.data.profile.portrait, state.data.profile.portrait);
    refs.portrait.replaceChildren(img);
  }

  function renderBrand() {
    const fragment = document.createDocumentFragment();

    arrayOf(state.data.profile.brand).forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line;
      fragment.appendChild(span);
    });

    refs.brand.replaceChildren(fragment);
  }

  function renderTraits() {
    const fragment = document.createDocumentFragment();

    arrayOf(state.data.profile.traits).forEach((trait) => {
      const row = document.createElement("div");
      row.className = "vi-trait";

      const label = document.createElement("div");
      label.className = "vi-trait-label";
      label.textContent = trait.label;

      const bar = document.createElement("div");
      bar.className = "vi-bar";

      const fill = document.createElement("i");
      fill.style.width = `${Number(trait.value) || 0}%`;

      bar.appendChild(fill);
      row.append(label, bar);
      fragment.appendChild(row);
    });

    refs.traits.replaceChildren(fragment);
  }

  function renderFilters() {
    const fragment = document.createDocumentFragment();

    arrayOf(state.data.filters).forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = filter.label;
      button.dataset.filter = filter.id;

      if (filter.id === state.status) {
        button.classList.add("is-active");
      }

      fragment.appendChild(button);
    });

    refs.filters.replaceChildren(fragment);
  }

  function bindEvents() {
    refs.filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");

      if (!button) {
        return;
      }

      state.status = button.dataset.filter;
      root.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.filter === state.status);
      });
      render();
    });

    refs.timeline.addEventListener("click", (event) => {
      const button = event.target.closest("[data-character-id]");

      if (!button) {
        return;
      }

      const character = findCharacterById(button.dataset.characterId);

      if (!character) {
        return;
      }

      state.character = state.character && state.character.id === character.id ? null : character;
      state.search = "";
      refs.search.value = "";
      render();
    });

    refs.search.addEventListener("input", () => {
      state.search = refs.search.value.trim();
      render();
    });

    refs.clear.addEventListener("click", () => {
      state.status = "all";
      state.search = "";
      state.character = null;
      refs.search.value = "";

      root.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.filter === "all");
      });

      render();
    });
  }

  function render() {
    const fragment = document.createDocumentFragment();
    let totalMatches = 0;

    arrayOf(state.data.categories).forEach((category) => {
      const games = arrayOf(category.games).filter((game) => matches(game, category));

      if (!games.length) {
        return;
      }

      totalMatches += games.length;
      fragment.appendChild(renderCategory(category, games));
    });

    if (!totalMatches) {
      const empty = document.createElement("div");
      empty.className = "vi-empty";
      empty.textContent = "Nincs találat a jelenlegi szűrésre.";
      fragment.appendChild(empty);
    }

    refs.timeline.replaceChildren(fragment);
    renderSelectedCharacter(totalMatches);
  }

  function renderCategory(category, games) {
    const details = document.createElement("details");
    details.className = "vi-cat";

    if (category.open || state.search || state.character || state.status !== "all") {
      details.open = true;
    }

    const summary = document.createElement("summary");
    summary.textContent = category.title;

    const list = document.createElement("div");
    list.className = "vi-list";

    games.forEach((game) => {
      list.appendChild(renderGame(game));
    });

    details.append(summary, list);
    return details;
  }

  function renderGame(game) {
    const item = document.createElement("article");
    item.className = "vi-item";
    item.dataset.status = game.status;
    item.style.setProperty("--game-image", cssUrl(game.image));

    const dot = document.createElement("div");
    dot.className = "vi-dot";

    const status = document.createElement("span");
    status.className = `vi-status vi-status--${game.status}`;
    status.textContent = statusLabel(game.status);

    const content = document.createElement("div");
    content.className = "vi-content";

    const title = document.createElement("div");
    title.className = "vi-title";
    title.textContent = game.title;

    const meta = document.createElement("div");
    meta.className = "vi-meta";
    meta.textContent = game.meta;

    const characters = renderCharacters(game);

    const footer = document.createElement("div");
    footer.className = "vi-card-footer";

    const link = document.createElement("a");
    link.className = "vi-open";
    link.href = game.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "MEGNYITÁS";

    footer.append(link);
    content.append(title, meta, characters, footer);
    item.append(dot, status, content);

    return item;
  }

  function renderCharacters(game) {
    const wrap = document.createElement("div");
    wrap.className = "vi-card-characters";

    const label = document.createElement("div");
    label.className = "vi-card-characters-label";
    label.textContent = "Karakterek";

    const list = document.createElement("div");
    list.className = "vi-character-list";

    arrayOf(game.characters).forEach((character) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vi-character-chip";
      button.dataset.characterId = character.id;
      button.setAttribute("aria-label", character.name);
      button.title = character.name;

      if (character.featured) {
        button.classList.add("vi-character-chip--featured");
      }

      if (state.character && state.character.id === character.id) {
        button.classList.add("is-active");
      }

      const img = document.createElement("img");
      img.alt = character.name;
      setSmartImage(img, character.image, state.data.profile.portrait);

      const name = document.createElement("span");
      name.textContent = character.name;

      button.append(img, name);
      list.appendChild(button);
    });

    wrap.append(label, list);
    return wrap;
  }

  function renderSelectedCharacter(totalMatches) {
    if (!state.character) {
      refs.selected.hidden = true;
      return;
    }

    refs.selected.hidden = false;
    refs.selectedName.textContent = state.character.name;
    refs.selectedCount.textContent = `${totalMatches} játék a kijelölt karakterrel`;
    setSmartImage(refs.selectedImage, state.character.image, state.data.profile.portrait);
  }

  function matches(game, category) {
    if (state.status !== "all" && game.status !== state.status) {
      return false;
    }

    if (state.character && !arrayOf(game.characters).some((character) => character.id === state.character.id)) {
      return false;
    }

    if (!state.search) {
      return true;
    }

    const characterNames = arrayOf(game.characters).map((character) => character.name).join(" ");

    const haystack = normalize([
      category.title,
      game.title,
      game.meta,
      game.participantsLabel,
      game.date,
      game.status,
      characterNames
    ].join(" "));

    return haystack.includes(normalize(state.search));
  }

  function findCharacterById(id) {
    for (const category of arrayOf(state.data.categories)) {
      for (const game of arrayOf(category.games)) {
        for (const character of arrayOf(game.characters)) {
          if (character.id === id) {
            return character;
          }
        }
      }
    }

    return null;
  }

  function statusLabel(status) {
    if (status === "active") {
      return "AKTÍV";
    }

    if (status === "closed") {
      return "LEZÁRT";
    }

    return String(status || "").toUpperCase();
  }

  function arrayOf(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function cssUrl(value) {
    const safe = String(value || "").replace(/["\\]/g, "\\$&");
    return `url("${safe}")`;
  }

  function setSmartImage(img, rawSource, fallback) {
    const attempts = buildImageAttempts(rawSource, fallback);
    let index = 0;

    img.onerror = () => {
      index += 1;

      if (index < attempts.length) {
        img.src = attempts[index];
      } else {
        img.onerror = null;
      }
    };

    img.src = attempts[index];
  }

  function buildImageAttempts(rawSource, fallback) {
    const source = String(rawSource || "").trim();
    const attempts = [];

    if (source) {
      if (/\.(png|jpe?g|webp|gif|avif)$/i.test(source) || /^https?:\/\//i.test(source)) {
        attempts.push(source);
      } else {
        attempts.push(`${source}.png`, `${source}.jpg`, `${source}.jpeg`, `${source}.webp`);
      }
    }

    if (fallback && !attempts.includes(fallback)) {
      attempts.push(fallback);
    }

    return attempts.length ? attempts : [""];
  }
})();
