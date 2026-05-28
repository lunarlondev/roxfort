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
    actor: null
  };

  const refs = {
    portrait: root.querySelector("[data-profile-portrait]"),
    brand: root.querySelector("[data-profile-brand]"),
    traits: root.querySelector("[data-profile-traits]"),
    filters: root.querySelector("[data-status-filters]"),
    actorList: root.querySelector("[data-actor-list]"),
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
    renderActors();
  }

  function renderPortrait() {
    const img = document.createElement("img");
    img.alt = "Vianne M. Gardner";
    setSmartImage(img, state.data.profile.portrait, state.data.profile.portrait);
    refs.portrait.replaceChildren(img);
  }

  function renderBrand() {
    const fragment = document.createDocumentFragment();

    state.data.profile.brand.forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line;
      fragment.appendChild(span);
    });

    refs.brand.replaceChildren(fragment);
  }

  function renderTraits() {
    const fragment = document.createDocumentFragment();

    state.data.profile.traits.forEach((trait) => {
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

    state.data.filters.forEach((filter) => {
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

  function renderActors() {
    const fragment = document.createDocumentFragment();

    state.data.actors.forEach((actor) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vi-character-chip";
      button.dataset.actor = actor.id;
      button.setAttribute("aria-label", actor.name);

      if (actor.featured) {
        button.classList.add("vi-character-chip--featured");
      }

      const img = document.createElement("img");
      img.alt = actor.name;
      setSmartImage(img, actor.image, state.data.profile.portrait);

      const name = document.createElement("span");
      name.textContent = actor.name;

      button.append(img, name);
      fragment.appendChild(button);
    });

    refs.actorList.replaceChildren(fragment);
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

    refs.actorList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-actor]");

      if (!button) {
        return;
      }

      const nextActor = button.dataset.actor;
      state.actor = state.actor === nextActor ? null : nextActor;

      root.querySelectorAll("[data-actor]").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.actor === state.actor);
      });

      render();
    });

    refs.search.addEventListener("input", () => {
      state.search = refs.search.value.trim();
      render();
    });

    refs.clear.addEventListener("click", () => {
      state.status = "all";
      state.search = "";
      state.actor = null;
      refs.search.value = "";

      root.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.filter === "all");
      });

      root.querySelectorAll("[data-actor]").forEach((item) => {
        item.classList.remove("is-active");
      });

      render();
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
  }

  function renderCategory(category, games) {
    const details = document.createElement("details");
    details.className = "vi-cat";

    if (category.open || state.search || state.actor || state.status !== "all") {
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

    const dot = document.createElement("div");
    dot.className = "vi-dot";

    const img = document.createElement("img");
    img.className = "vi-img";
    img.alt = game.title;
    setSmartImage(img, game.image, state.data.profile.portrait);

    const content = document.createElement("div");
    content.className = "vi-content";

    const title = document.createElement("div");
    title.className = "vi-title";
    title.textContent = game.title;

    const meta = document.createElement("div");
    meta.className = "vi-meta";
    meta.textContent = game.meta;

    const footer = document.createElement("div");
    footer.className = "vi-card-footer";

    const status = document.createElement("span");
    status.className = `vi-status vi-status--${game.status}`;
    status.textContent = game.status.toUpperCase();

    const link = document.createElement("a");
    link.className = "vi-open";
    link.href = game.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "MEGNYITÁS";

    footer.append(status, link);
    content.append(title, meta, footer);
    item.append(dot, img, content);

    return item;
  }

  function renderSelectedCharacter(totalMatches) {
    const actor = state.actor ? state.data.actors.find((item) => item.id === state.actor) : null;

    if (!actor) {
      refs.selected.hidden = true;
      return;
    }

    refs.selected.hidden = false;
    refs.selectedName.textContent = actor.name;
    refs.selectedCount.textContent = `${totalMatches} játék a kijelölt karakterrel`;
    setSmartImage(refs.selectedImage, actor.image, state.data.profile.portrait);
  }

  function matches(game, category) {
    if (state.status !== "all" && game.status !== state.status) {
      return false;
    }

    if (state.actor && !game.actors.includes(state.actor)) {
      return false;
    }

    if (!state.search) {
      return true;
    }

    const actorNames = game.actors
      .map((id) => state.data.actors.find((actor) => actor.id === id))
      .filter(Boolean)
      .map((actor) => actor.name)
      .join(" ");

    const haystack = normalize([
      category.title,
      game.title,
      game.meta,
      game.participantsLabel,
      game.date,
      game.status,
      actorNames
    ].join(" "));

    return haystack.includes(normalize(state.search));
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
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
