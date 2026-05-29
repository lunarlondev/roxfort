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
    sidebarStats: root.querySelector("[data-sidebar-stats]"),
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
  const scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : "";

  const statusLabels = {
    all: "Összes",
    aktiv: "Aktív",
    lezart: "Lezárt"
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      state.data = await loadJsonData(source);
      normalizeData();
      renderStaticParts();
      bindEvents();
      render();
    } catch (error) {
      console.error("Vianne tracker adatbetöltési hiba:", error);
      const message = error && error.message ? error.message : "Ismeretlen hiba.";
      refs.timeline.innerHTML = `<div class="vi-error">Nem sikerült betölteni a viannetracker-data.json fájlt.<br><small>${escapeHtml(message)}</small></div>`;
    }
  }

  async function loadJsonData(rawSource) {
    const urls = buildJsonUrls(rawSource);
    const errors = [];

    for (const url of urls) {
      try {
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          errors.push(`${url} - HTTP ${response.status}`);
          continue;
        }

        const text = await response.text();

        try {
          return JSON.parse(text);
        } catch (parseError) {
          const preview = text.trim().slice(0, 80).replace(/\s+/g, " ");
          throw new Error(`A JSON fájl elérhető, de nem érvényes JSON. Eleje: ${preview}`);
        }
      } catch (fetchError) {
        errors.push(`${url} - ${fetchError.message}`);
      }
    }

    throw new Error(`Nem található vagy nem olvasható adatfájl. Próbált útvonalak: ${errors.join(" | ")}`);
  }

  function buildJsonUrls(rawSource) {
    const src = String(rawSource || "viannetracker-data.json").trim();
    const urls = [];

    addJsonUrl(urls, src, window.location.href);

    if (scriptUrl) {
      addJsonUrl(urls, src, scriptUrl);
    }

    if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) {
      addJsonUrl(urls, `./${src.replace(/^\.\//, "")}`, window.location.href);
    }

    return urls;
  }

  function addJsonUrl(urls, src, base) {
    try {
      const url = new URL(src, base).href;

      if (!urls.includes(url)) {
        urls.push(url);
      }
    } catch (error) {
      if (!urls.includes(src)) {
        urls.push(src);
      }
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeData() {
    state.data.filters = Array.isArray(state.data.filters) && state.data.filters.length
      ? state.data.filters
      : [
        { id: "all", label: "Összes" },
        { id: "aktiv", label: "Aktív" },
        { id: "lezart", label: "Lezárt" }
      ];

    getAllGames().forEach((game) => {
      game.status = statusKey(game.status);
      game.characters = Array.isArray(game.characters) ? game.characters : [];
    });
  }

  function renderStaticParts() {
    renderPortrait();
    renderBrand();
    renderFilters();
  }

  function renderPortrait() {
    const img = document.createElement("img");
    img.alt = "Vianne M. Gardner";
    setSmartImage(img, state.data.profile?.portrait, state.data.profile?.portrait);
    refs.portrait.replaceChildren(img);
  }

  function renderBrand() {
    const fragment = document.createDocumentFragment();
    const lines = Array.isArray(state.data.profile?.brand) ? state.data.profile.brand : ["VIANNE", "MAEVE", "GARDNER"];

    lines.forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line;
      fragment.appendChild(span);
    });

    refs.brand.replaceChildren(fragment);
  }

  function renderFilters() {
    const fragment = document.createDocumentFragment();

    state.data.filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = filter.label || statusLabel(filter.id);
      button.dataset.filter = statusKey(filter.id);

      if (button.dataset.filter === state.status) {
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
      updateFilterButtons();
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
      updateFilterButtons();
      render();
    });
  }

  function updateFilterButtons() {
    root.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.filter === state.status);
    });
  }

  function render() {
    const fragment = document.createDocumentFragment();
    let totalMatches = 0;

    state.data.categories.forEach((category) => {
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
    renderSidebarStats(totalMatches);
  }


  function renderSidebarStats(visibleCount) {
    if (!refs.sidebarStats) {
      return;
    }

    const allGames = getAllGames();
    const total = allGames.length;
    const active = allGames.filter((game) => statusKey(game.status) === "aktiv").length;
    const closed = allGames.filter((game) => statusKey(game.status) === "lezart").length;
    const current = state.character
      ? state.character.name
      : state.search
        ? "Keresés aktív"
        : state.status !== "all"
          ? statusLabel(state.status)
          : "Minden játék";

    const stats = [
      { label: "Látszik", value: visibleCount },
      { label: "Összesen", value: total },
      { label: "Aktív", value: active },
      { label: "Lezárt", value: closed }
    ];

    const fragment = document.createDocumentFragment();

    const currentBox = document.createElement("div");
    currentBox.className = "vi-side-stat vi-side-stat--wide";

    const currentValue = document.createElement("strong");
    currentValue.textContent = current;

    const currentLabel = document.createElement("span");
    currentLabel.textContent = "Jelenlegi nézet";

    currentBox.append(currentValue, currentLabel);
    fragment.appendChild(currentBox);

    stats.forEach((item) => {
      const box = document.createElement("div");
      box.className = "vi-side-stat";

      const value = document.createElement("strong");
      value.textContent = String(item.value);

      const label = document.createElement("span");
      label.textContent = item.label;

      box.append(value, label);
      fragment.appendChild(box);
    });

    refs.sidebarStats.replaceChildren(fragment);
  }

  function renderCategory(category, games) {
    const details = document.createElement("details");
    details.className = "vi-cat";

    if (category.open || state.search || state.character || state.status !== "all") {
      details.open = true;
    }

    const summary = document.createElement("summary");

    const title = document.createElement("span");
    title.className = "vi-cat-title";
    title.textContent = category.title;

    const count = document.createElement("span");
    count.className = "vi-cat-count";
    count.textContent = `${games.length} játék`;

    summary.append(title, count);

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

    const skin = document.createElement("div");
    skin.className = "vi-card-skin";

    const bg = document.createElement("img");
    bg.alt = "";
    setSmartImage(bg, game.image, state.data.profile?.portrait);
    skin.appendChild(bg);

    const dot = document.createElement("div");
    dot.className = "vi-dot";

    const status = document.createElement("span");
    status.className = `vi-status vi-status--${statusKey(game.status)}`;
    status.textContent = statusLabel(game.status);

    const content = document.createElement("div");
    content.className = "vi-content";

    const title = document.createElement("div");
    title.className = "vi-title";
    title.textContent = game.title || "Cím nélküli játék";

    const meta = document.createElement("div");
    meta.className = "vi-meta";

    if (game.participantsLabel || game.meta) {
      meta.appendChild(infoLine("Játékosok", game.participantsLabel || game.meta));
    }

    if (game.date) {
      meta.appendChild(infoLine("Dátum", game.date));
    }

    const characters = renderCharacters(game);

    const footer = document.createElement("div");
    footer.className = "vi-card-footer";

    if (game.url) {
      const link = document.createElement("a");
      link.className = "vi-open";
      link.href = game.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Megnyitás";
      footer.appendChild(link);
    }

    content.append(title, meta);

    if (characters) {
      content.appendChild(characters);
    }

    content.appendChild(footer);
    item.append(skin, dot, status, content);

    return item;
  }

  function infoLine(label, value) {
    const line = document.createElement("span");
    line.className = "vi-line";

    const strong = document.createElement("b");
    strong.textContent = `${label}: `;

    line.append(strong, document.createTextNode(value));
    return line;
  }

  function renderCharacters(game) {
    const characters = Array.isArray(game.characters) ? game.characters : [];

    if (!characters.length) {
      return null;
    }

    const area = document.createElement("div");
    area.className = "vi-character-area";

    const label = document.createElement("div");
    label.className = "vi-character-label";
    label.textContent = "Szereplők";

    const list = document.createElement("div");
    list.className = "vi-character-list";

    characters.forEach((character) => {
      const name = characterName(character);

      if (!name) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "vi-character-chip";
      button.dataset.character = normalize(name);
      button.setAttribute("aria-label", name);

      if (state.character && sameName(state.character.name, name)) {
        button.classList.add("is-active");
      }

      if (character.featured) {
        button.classList.add("vi-character-chip--featured");
      }

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleCharacter(character);
      });

      const img = document.createElement("img");
      img.alt = name;
      setSmartImage(img, characterImage(character), state.data.profile?.portrait);

      const text = document.createElement("span");
      text.textContent = name;

      button.append(img, text);
      list.appendChild(button);
    });

    area.append(label, list);
    return area;
  }

  function toggleCharacter(character) {
    const name = characterName(character);

    if (!name) {
      return;
    }

    if (state.character && sameName(state.character.name, name)) {
      state.character = null;
    } else {
      state.character = {
        name,
        image: characterImage(character)
      };
    }

    render();
  }

  function renderSelectedCharacter(totalMatches) {
    if (!state.character) {
      refs.selected.hidden = true;
      return;
    }

    refs.selected.hidden = false;
    refs.selectedName.textContent = state.character.name;
    refs.selectedCount.textContent = `${totalMatches} játék a kijelölt karakterrel`;
    setSmartImage(refs.selectedImage, state.character.image, state.data.profile?.portrait);
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

    const haystack = normalize([
      category.title,
      game.title,
      game.meta,
      game.participantsLabel,
      game.date,
      statusLabel(game.status),
      statusKey(game.status),
      Array.isArray(game.tags) ? game.tags.join(" ") : "",
      game.characters.map((character) => characterName(character)).join(" ")
    ].join(" "));

    return haystack.includes(normalize(state.search));
  }

  function getAllGames() {
    const categories = Array.isArray(state.data?.categories) ? state.data.categories : [];
    return categories.flatMap((category) => Array.isArray(category.games) ? category.games : []);
  }

  function gameHasCharacter(game, name) {
    return game.characters.some((character) => sameName(characterName(character), name));
  }

  function characterName(character) {
    if (typeof character === "string") {
      return character;
    }

    return character?.name || character?.title || "";
  }

  function characterImage(character) {
    if (typeof character === "string") {
      return "";
    }

    return character?.image || character?.avatar || "";
  }

  function sameName(first, second) {
    return normalize(first) === normalize(second);
  }

  function statusKey(value) {
    const key = normalize(value).replace(/\s+/g, "-");

    if (key === "active" || key === "aktiv" || key === "aktív") {
      return "aktiv";
    }

    if (key === "closed" || key === "lezart" || key === "lezárt") {
      return "lezart";
    }

    if (key === "all" || key === "osszes" || key === "összes") {
      return "all";
    }

    return key || "ismeretlen";
  }

  function statusLabel(value) {
    return statusLabels[statusKey(value)] || value || "Ismeretlen";
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
