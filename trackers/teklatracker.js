(() => {
  const root = document.getElementById("teklaTracker");
  if (!root) return;

  const source = root.dataset.source || "teklatracker-data.json";

  const state = {
    status: "all",
    query: "",
    actor: null,
    openCategories: new Set()
  };

  let data = null;
  let tooltip = null;
  let tooltipTarget = null;

  root.innerHTML = '<div class="teklatracker-loading">Adatok betöltése...</div>';

  fetch(source)
    .then((response) => {
      if (!response.ok) throw new Error("Nem sikerült betölteni a JSON fájlt.");
      return response.json();
    })
    .then((json) => {
      data = json;
      (data.categories || []).forEach((category) => {
        if (category.open) state.openCategories.add(category.id);
      });
      render();
    })
    .catch((error) => {
      root.innerHTML = `<div class="teklatracker-error">${escapeText(error.message)}<br>Helyi tesztnél indítsd localhostról, ne közvetlen file:// megnyitással.</div>`;
    });

  root.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-filter]");
    const actorButton = event.target.closest("[data-actor]");
    const clearActor = event.target.closest("[data-clear-actor]");

    if (filterButton) {
      rememberOpenCategories();
      state.status = filterButton.dataset.filter || "all";
      render();
      return;
    }

    if (actorButton) {
      rememberOpenCategories();
      const key = actorButton.dataset.actor;
      state.actor = state.actor === key ? null : key;
      render();
      return;
    }

    if (clearActor) {
      rememberOpenCategories();
      state.actor = null;
      render();
      return;
    }

  });

  root.addEventListener("input", (event) => {
    if (!event.target.matches("[data-search]")) return;
    rememberOpenCategories();
    state.query = event.target.value || "";
    renderContentOnly();
  });

  root.addEventListener("toggle", (event) => {
    const details = event.target.closest("details[data-category-id]");
    if (!details) return;

    if (details.open) state.openCategories.add(details.dataset.categoryId);
    else state.openCategories.delete(details.dataset.categoryId);
  }, true);

  root.addEventListener("mouseover", (event) => {
    const button = event.target.closest(".teklatracker-actor-btn[data-actor-name]");
    if (!button) return;
    showTooltip(button, event);
  });

  root.addEventListener("mousemove", (event) => {
    if (tooltipTarget) moveTooltip(event);
  });

  root.addEventListener("mouseout", (event) => {
    const button = event.target.closest(".teklatracker-actor-btn[data-actor-name]");
    if (!button || button !== tooltipTarget) return;
    if (event.relatedTarget && button.contains(event.relatedTarget)) return;
    hideTooltip();
  });

  function render() {
    hideTooltip();
    root.innerHTML = "";
    root.append(renderHero(), renderControls(), renderContent());
  }

  function renderContentOnly() {
    hideTooltip();
    const old = root.querySelector(".teklatracker-content");
    const next = renderContent();
    if (old) old.replaceWith(next);

    const stats = root.querySelector(".teklatracker-hero-stats");
    if (stats) stats.replaceWith(renderHeroStats());

    const search = root.querySelector("[data-search]");
    if (search) {
      search.value = state.query;
      search.focus();
      const end = search.value.length;
      try { search.setSelectionRange(end, end); } catch (_) {}
    }
  }

  function renderHero() {
    const profile = data.profile || {};

    const hero = el("header", "teklatracker-hero");

    const photo = el("div", "teklatracker-photo");
    const image = document.createElement("img");
    image.src = profile.portrait || "";
    image.alt = profile.name || "Tekla";
    photo.appendChild(image);

    const heading = el("div", "teklatracker-heading");
    const kicker = el("span", "teklatracker-kicker", profile.label || "game archive");
    const title = document.createElement("h1");
    const titleParts = String(profile.name || "Tekla").trim().split(/\s+/);
    if (titleParts.length > 1) {
      const first = titleParts.shift();
      const accent = document.createElement("span");
      accent.className = "accent";
      accent.textContent = first;
      title.append(accent, document.createElement("br"), document.createTextNode(titleParts.join(" ")));
    } else {
      const accent = document.createElement("span");
      accent.className = "accent";
      accent.textContent = titleParts[0] || "Tekla";
      title.appendChild(accent);
    }

    const subtitle = el("div", "teklatracker-subtitle", profile.subtitle || "játékkövető");
    heading.append(kicker, title, subtitle);

    hero.append(photo, heading, renderHeroStats());
    return hero;
  }

  function renderHeroStats() {
    const allGames = allGamesList();
    const visible = allGames.filter(matchesFilters);
    const active = allGames.filter((game) => statusKey(game.status) === "active").length;
    const closed = allGames.filter((game) => statusKey(game.status) === "closed").length;

    const stats = el("div", "teklatracker-hero-stats");
    stats.append(
      statBox(visible.length, "találat"),
      statBox(active, "aktív"),
      statBox(closed, "lezárt")
    );
    return stats;
  }

  function renderControls() {
    const controls = el("section", "teklatracker-controls");

    const code = el("div", "teklatracker-control-code", "TRACKER");

    const main = el("div", "teklatracker-control-main");
    const search = document.createElement("input");
    search.className = "teklatracker-search";
    search.type = "search";
    search.placeholder = "Keresés címre, szereplőre, helyszínre...";
    search.value = state.query;
    search.dataset.search = "true";

    const filters = el("div", "teklatracker-filters");
    [
      ["all", "Mind"],
      ["active", "Aktív"],
      ["closed", "Lezárt"],
      ["paused", "Szünetel"]
    ].forEach(([key, label]) => {
      const button = el("button", "teklatracker-filter", label);
      button.type = "button";
      button.dataset.filter = key;
      if (state.status === key) button.classList.add("is-active");
      filters.appendChild(button);
    });

    main.append(search, filters);

    const mark = el("div", "teklatracker-control-mark", "×");

    controls.append(code, main, mark);
    return controls;
  }

  function renderContent() {
    const content = el("main", "teklatracker-content");

    const visibleGames = allGamesList().filter(matchesFilters);
    const selectedActor = state.actor ? findActorByKey(state.actor) : null;

    if (selectedActor) {
      content.appendChild(renderSelectedActor(selectedActor, visibleGames.length));
    }

    let categoryCount = 0;

    (data.categories || []).forEach((category, index) => {
      const games = (category.games || []).filter(matchesFilters);
      if (!games.length) return;

      categoryCount += 1;

      const details = el("details", "teklatracker-category");
      details.dataset.categoryId = category.id || `category-${index}`;
      if (state.openCategories.has(details.dataset.categoryId)) details.open = true;

      const summary = document.createElement("summary");
      const number = el("span", "teklatracker-category-index", String(index + 1).padStart(2, "0"));
      const title = el("span", "teklatracker-category-title", category.title || "Egyéb");
      const count = el("span", "teklatracker-category-count", `${games.length} játék`);
      summary.append(number, title, count);

      const grid = el("div", "teklatracker-grid");
      games.forEach((game) => grid.appendChild(renderCard(game)));

      details.append(summary, grid);
      content.appendChild(details);
    });

    if (!categoryCount || !visibleGames.length) {
      content.appendChild(el("div", "teklatracker-empty", "Nincs találat ehhez a szűréshez."));
    }

    return content;
  }

  function renderSelectedActor(actor, visibleCount) {
    const strip = el("div", "teklatracker-selected");

    const image = el("div", "teklatracker-selected-image");
    image.appendChild(actorImage(actor, actor.name));

    const text = el("div", "teklatracker-selected-text");
    const strong = document.createElement("strong");
    strong.textContent = actor.name || "Szereplő";
    const small = document.createElement("small");
    small.textContent = `${visibleCount} játék látszik`;
    text.append(strong, small);

    const clear = el("button", "teklatracker-clear-actor", "Szűrés törlése");
    clear.type = "button";
    clear.dataset.clearActor = "true";

    strip.append(image, text, clear);
    return strip;
  }

  function renderCard(game) {
    const status = statusKey(game.status);
    const article = el("article", "teklatracker-card");
    const visual = el("div", "teklatracker-card-visual");
    const image = document.createElement("img");
    image.src = game.image || data.profile?.portrait || "";
    image.alt = game.title || "Játék";
    image.loading = "lazy";
    visual.appendChild(image);

    const badge = el("span", `teklatracker-status status-${status}`, statusLabel(status));
    visual.appendChild(badge);

    const cardData = el("div", "teklatracker-card-data");
    const title = el("h3", "teklatracker-card-title", game.title || "Névtelen játék");

    const meta = el("div", "teklatracker-meta");
    if (game.location) meta.appendChild(metaLine("Helyszín", game.location));
    if (game.date) meta.appendChild(metaLine("Dátum", game.date));
    if (game.theme) meta.appendChild(metaLine("Téma", game.theme));

    const actors = el("div", "teklatracker-actors");
    getActors(game).forEach((actor) => {
      const button = el("button", "teklatracker-actor-btn");
      button.type = "button";
      button.dataset.actor = actor.key;
      button.dataset.actorName = actor.name;
      button.setAttribute("aria-label", actor.name);
      if (actor.featured) button.classList.add("is-featured");
      if (state.actor === actor.key) button.classList.add("is-active");

      const wrap = el("span", "teklatracker-actor-image");
      wrap.appendChild(actorImage(actor, actor.name));
      button.appendChild(wrap);
      actors.appendChild(button);
    });

    cardData.append(title, meta);
    if (actors.childElementCount) cardData.appendChild(actors);

    if (game.url) {
      const actions = el("div", "teklatracker-actions");
      const link = el("a", "teklatracker-action primary", "Megnyitás");
      link.href = game.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      actions.appendChild(link);
      cardData.appendChild(actions);
    }

    article.append(visual, cardData);
    return article;
  }

  function matchesFilters(game) {
    const wantedStatus = state.status === "all" || statusKey(game.status) === state.status;
    const wantedActor = !state.actor || getActors(game).some((actor) => actor.key === state.actor);

    const query = normalize(state.query);
    if (!query) return wantedStatus && wantedActor;

    const searchable = [
      game.title,
      game.location,
      game.date,
      game.theme,
      game.description,
      ...(game.tags || []),
      ...getActors(game).map((actor) => actor.name)
    ].map(normalize).join(" ");

    return wantedStatus && wantedActor && searchable.includes(query);
  }

  function rememberOpenCategories() {
    root.querySelectorAll("details[data-category-id]").forEach((details) => {
      if (details.open) state.openCategories.add(details.dataset.categoryId);
      else state.openCategories.delete(details.dataset.categoryId);
    });
  }

  function allGamesList() {
    return (data.categories || []).flatMap((category) => category.games || []);
  }

  function getActors(game) {
    return (game.actors || game.characters || [])
      .map(normalizeActor)
      .filter(Boolean);
  }

  function normalizeActor(entry) {
    if (typeof entry === "string") {
      const name = entry.trim();
      if (!name) return null;
      return { key: slugify(name), name, image:"", featured:false };
    }

    if (!entry || typeof entry !== "object") return null;

    const name = String(entry.name || "").trim();
    if (!name) return null;

    return {
      key: slugify(name),
      name,
      image: String(entry.image || "").trim(),
      featured: entry.featured === true
    };
  }

  function findActorByKey(key) {
    for (const game of allGamesList()) {
      const actor = getActors(game).find((item) => item.key === key);
      if (actor) return actor;
    }
    return null;
  }

  function actorImage(actor, alt) {
    const imageName = actor.image || "";

    if (!imageName) {
      return el("span", "teklatracker-actor-initial", initials(alt));
    }

    const img = document.createElement("img");
    img.alt = alt || "";
    img.loading = "lazy";
    img.src = actorPath(imageName);

    img.addEventListener("error", () => {
      const fallback = el("span", "teklatracker-actor-initial", initials(alt));
      img.replaceWith(fallback);
    }, { once:true });

    return img;
  }

  function actorPath(imageName) {
    const image = String(imageName || "").trim();
    if (!image) return "";
    if (/^(https?:)?\/\//.test(image) || image.startsWith("/") || image.startsWith("data:")) return image;
    if (image.includes("/")) return image;

    const base = data.actorImagePath || "actors/";
    return `${base.replace(/\/?$/, "/")}${image}`;
  }

  function statBox(value, label) {
    const box = el("div", "teklatracker-stat");
    const strong = document.createElement("b");
    strong.textContent = value;
    const small = document.createElement("span");
    small.textContent = label;
    box.append(strong, small);
    return box;
  }

  function metaLine(label, value) {
    const p = document.createElement("p");
    const b = document.createElement("b");
    b.textContent = label;
    p.append(b, document.createTextNode(value));
    return p;
  }

  function statusKey(status) {
    const key = normalize(status).replace(/\s+/g, "-");

    const aliases = {
      aktiv:"active",
      active:"active",
      lezart:"closed",
      closed:"closed",
      szunetel:"paused",
      paused:"paused",
      tervezett:"planned",
      planned:"planned",
      elakadt:"stuck",
      stuck:"stuck"
    };

    return aliases[key] || key || "closed";
  }

  function statusLabel(status) {
    return {
      active:"Aktív",
      closed:"Lezárt",
      paused:"Szünetel",
      planned:"Tervezett",
      stuck:"Elakadt"
    }[status] || status;
  }

  function showTooltip(button, event) {
    if (!tooltip) {
      tooltip = el("div", "teklatracker-tooltip");
      document.body.appendChild(tooltip);
    }

    tooltipTarget = button;
    tooltip.textContent = button.dataset.actorName || "";
    tooltip.classList.add("is-visible");
    moveTooltip(event);
  }

  function moveTooltip(event) {
    if (!tooltip) return;

    const offset = 13;
    const x = Math.min(event.clientX + offset, window.innerWidth - tooltip.offsetWidth - 8);
    const y = Math.max(event.clientY - tooltip.offsetHeight - offset, 8);

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function hideTooltip() {
    tooltipTarget = null;
    if (tooltip) tooltip.classList.remove("is-visible");
  }

  function initials(name) {
    return String(name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0,2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("hu-HU")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function slugify(value) {
    return normalize(value)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "actor";
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function escapeText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
})();
