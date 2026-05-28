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

  const statusMap = {
    all: "ALL",
    active: "ACTIVE",
    closed: "CLOSED"
  };

  const statusAliases = {
    aktiv: "active",
    active: "active",
    lezart: "closed",
    closed: "closed"
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

  function profile() {
    return state.data.profile || {};
  }

  function fallbackImage() {
    return state.data.meta?.defaultCharacterImage || state.data.meta?.defaultImage || profile().portrait || "";
  }

  function renderPortrait() {
    const img = document.createElement("img");
    img.alt = profile().brand?.join(" ") || state.data.meta?.title || "Vianne M. Gardner";
    setSmartImage(img, profile().portrait || state.data.meta?.heroImage, fallbackImage());
    refs.portrait.replaceChildren(img);
  }

  function renderBrand() {
    const brand = Array.isArray(profile().brand) ? profile().brand : [state.data.meta?.title || "Vianne"];
    const fragment = document.createDocumentFragment();

    brand.forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line;
      fragment.appendChild(span);
    });

    refs.brand.replaceChildren(fragment);
  }

  function renderTraits() {
    const traits = Array.isArray(profile().traits) ? profile().traits : [];
    const fragment = document.createDocumentFragment();

    traits.forEach((trait) => {
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
    const filters = Array.isArray(state.data.filters) ? state.data.filters : [
      { id: "all", label: "ALL" },
      { id: "active", label: "ACTIVE" },
      { id: "closed", label: "CLOSED" }
    ];

    const fragment = document.createDocumentFragment();

    filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = filter.label || statusMap[filter.id] || filter.id;
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
      const button = event.target.closest("[data-character-name]");

      if (!button) {
        return;
      }

      const name = button.dataset.characterName;
      const image = button.dataset.characterImage;
      const sameCharacter = state.character && sameName(state.character.name, name);
      state.character = sameCharacter ? null : { name, image };
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

    categoriesWithGames().forEach((category) => {
      const games = category.games.filter((game) => matches(game, category));

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

  function categoriesWithGames() {
    const categories = Array.isArray(state.data.categories) ? state.data.categories : [];
    const games = Array.isArray(state.data.games) ? state.data.games : [];

    return categories.map((category) => ({
      id: category.id,
      title: category.title,
      open: category.open,
      games: games.filter((game) => (game.categoryId || game.category) === category.id)
    }));
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
    item.dataset.status = statusKey(game.status);

    const dot = document.createElement("div");
    dot.className = "vi-dot";

    const img = document.createElement("img");
    img.className = "vi-img";
    img.alt = game.title || "";
    setSmartImage(img, game.image, fallbackImage());

    const content = document.createElement("div");
    content.className = "vi-content";

    const title = document.createElement("div");
    title.className = "vi-title";
    title.textContent = game.title || "Cím nélküli játék";

    const meta = document.createElement("div");
    meta.className = "vi-meta";
    meta.textContent = game.meta || buildMeta(game);

    const characters = renderCharacters(game);

    const footer = document.createElement("div");
    footer.className = "vi-card-footer";

    const status = document.createElement("span");
    const key = statusKey(game.status);
    status.className = `vi-status vi-status--${key}`;
    status.textContent = statusLabel(game.status).toUpperCase();
    footer.appendChild(status);

    const href = game.link || game.url || "";

    if (href) {
      const link = document.createElement("a");
      link.className = "vi-open";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "MEGNYITÁS";
      footer.appendChild(link);
    }

    content.append(title, meta);

    if (characters) {
      content.appendChild(characters);
    }

    content.appendChild(footer);
    item.append(dot, img, content);

    return item;
  }

  function renderCharacters(game) {
    const characters = Array.isArray(game.characters) ? game.characters : [];

    if (!characters.length) {
      return null;
    }

    const wrap = document.createElement("div");
    wrap.className = "vi-characters";

    characters.forEach((character) => {
      const name = characterName(character);

      if (!name) {
        return;
      }

      const image = characterImage(character);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vi-character-chip";
      button.dataset.characterName = name;
      button.dataset.characterImage = image;
      button.setAttribute("aria-label", name);

      if (state.character && sameName(state.character.name, name)) {
        button.classList.add("is-active");
      }

      if (characterFeatured(character, game)) {
        button.classList.add("vi-character-chip--featured");
      }

      const img = document.createElement("img");
      img.alt = name;
      setSmartImage(img, image, fallbackImage());

      const label = document.createElement("span");
      label.textContent = name;

      button.append(img, label);
      wrap.appendChild(button);
    });

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
    setSmartImage(refs.selectedImage, state.character.image, fallbackImage());
  }

  function matches(game, category) {
    if (state.status !== "all" && statusKey(game.status) !== state.status) {
      return false;
    }

    if (state.character && !gameHasCharacter(game, state.character.name)) {
      return false;
    }

    if (!state.search) {
      return true;
    }

    const characterNames = characterList(game).map(characterName).join(" ");
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

  function characterList(game) {
    return Array.isArray(game.characters) ? game.characters : [];
  }

  function characterName(character) {
    if (typeof character === "string") {
      return character;
    }

    return character?.name || character?.title || character?.id || "";
  }

  function characterImage(character) {
    if (character && typeof character === "object") {
      return character.image || character.avatar || character.photo || imagePathFromName(characterName(character));
    }

    return imagePathFromName(characterName(character));
  }

  function characterFeatured(character, game) {
    const name = characterName(character);
    const lists = [
      ...(Array.isArray(game.featuredCharacters) ? game.featuredCharacters : []),
      ...(Array.isArray(game.highlightedCharacters) ? game.highlightedCharacters : []),
      ...(Array.isArray(game.importantCharacters) ? game.importantCharacters : [])
    ];

    return Boolean(character?.featured || character?.highlighted || character?.important || lists.some((item) => sameName(characterName(item) || item, name)));
  }

  function gameHasCharacter(game, name) {
    return characterList(game).some((character) => sameName(characterName(character), name));
  }

  function sameName(first, second) {
    return normalize(first) === normalize(second);
  }

  function statusKey(status) {
    const normalized = normalize(status).replace(/\s+/g, "-");
    return statusAliases[normalized] || normalized || "unknown";
  }

  function statusLabel(status) {
    const key = statusKey(status);

    if (key === "active") {
      return "Aktív";
    }

    if (key === "closed") {
      return "Lezárt";
    }

    return status || "Ismeretlen";
  }

  function buildMeta(game) {
    return [game.participantsLabel, game.date].filter(Boolean).join(" · ");
  }

  function imagePathFromName(name) {
    const slug = normalize(name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return slug ? `actors/${slug}` : "";
  }

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("hu-HU")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
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
      if (/\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(source) || /^(https?:|data:|blob:)/i.test(source)) {
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
