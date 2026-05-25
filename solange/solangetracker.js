const solangetrackerState = {
  data: null,
  games: [],
  filter: "all",
  query: "",
  selectedId: null,
  openCategories: new Set()
};

const solangetrackerDom = {
  title: document.getElementById("solangetrackerTitle"),
  subtitle: document.getElementById("solangetrackerSubtitle"),
  intro: document.getElementById("solangetrackerIntro"),
  heroImage: document.getElementById("solangetrackerHeroImage"),
  search: document.getElementById("solangetrackerSearch"),
  filters: document.querySelectorAll(".solangetracker-filter"),
  openAll: document.getElementById("solangetrackerOpenAll"),
  closeAll: document.getElementById("solangetrackerCloseAll"),
  stats: document.getElementById("solangetrackerStats"),
  reader: document.getElementById("solangetrackerReader"),
  list: document.getElementById("solangetrackerList"),
  empty: document.getElementById("solangetrackerEmpty"),
  visibleCount: document.getElementById("solangetrackerVisibleCount")
};

const solangetrackerStatus = {
  active: "Aktív",
  closed: "Lezárt",
  paused: "Szünetel",
  planned: "Tervezett",
  stuck: "Elakadt"
};

const solangetrackerStatusAliases = {
  aktiv: "active",
  active: "active",
  lezart: "closed",
  closed: "closed",
  szunetel: "paused",
  paused: "paused",
  tervezett: "planned",
  planned: "planned",
  elakadt: "stuck",
  stuck: "stuck"
};

function solangetrackerNormalize(value){
  return String(value || "")
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function solangetrackerArray(value){
  return Array.isArray(value) ? value : [];
}

function solangetrackerStatusKey(status){
  const key = solangetrackerNormalize(status).replace(/\s+/g, "-");
  return solangetrackerStatusAliases[key] || key || "unknown";
}

function solangetrackerStatusLabel(status){
  const key = solangetrackerStatusKey(status);
  return solangetrackerStatus[key] || status || "Ismeretlen";
}

function solangetrackerDefaultImage(){
  return solangetrackerState.data?.meta?.defaultImage || "images/gif/kkny.gif";
}

function solangetrackerCreateEl(tag, className, text){
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  if (text !== undefined && text !== null) {
    el.textContent = text;
  }

  return el;
}

function solangetrackerSetImage(img, src){
  img.src = src || solangetrackerDefaultImage();
  img.alt = "";

  img.addEventListener("error", () => {
    img.src = solangetrackerDefaultImage();
  }, { once: true });
}

function solangetrackerCategoryId(game){
  return game.categoryId || game.category || "other";
}

function solangetrackerGetCategories(){
  const categories = solangetrackerState.data?.categories;

  if (Array.isArray(categories) && categories.length > 0) {
    return categories;
  }

  const seen = new Set();

  return solangetrackerState.games
    .map(game => solangetrackerCategoryId(game))
    .filter(id => {
      if (seen.has(id)) {
        return false;
      }

      seen.add(id);
      return true;
    })
    .map(id => ({
      id,
      title: id,
      open: false
    }));
}

function solangetrackerCategoryTitle(categoryId){
  const category = solangetrackerGetCategories().find(item => item.id === categoryId);
  return category?.title || categoryId || "Egyéb";
}

function solangetrackerSearchBlob(game){
  const parts = [
    game.title,
    solangetrackerCategoryTitle(solangetrackerCategoryId(game)),
    game.status,
    solangetrackerStatusLabel(game.status),
    game.date,
    game.topic,
    game.location,
    game.summary,
    solangetrackerArray(game.characters).join(" "),
    solangetrackerArray(game.tags).join(" ")
  ];

  return solangetrackerNormalize(parts.join(" "));
}

function solangetrackerGetFilteredGames(){
  const query = solangetrackerNormalize(solangetrackerState.query);

  return solangetrackerState.games.filter(game => {
    const statusOk = solangetrackerState.filter === "all" || solangetrackerStatusKey(game.status) === solangetrackerState.filter;
    const queryOk = !query || solangetrackerSearchBlob(game).includes(query);

    return statusOk && queryOk;
  });
}

function solangetrackerGroupByCategory(games){
  const categories = solangetrackerGetCategories();

  const groups = categories.map(category => ({
    id: category.id,
    category: category.title,
    games: []
  }));

  games.forEach(game => {
    const categoryId = solangetrackerCategoryId(game);
    let group = groups.find(item => item.id === categoryId);

    if (!group) {
      group = {
        id: categoryId,
        category: solangetrackerCategoryTitle(categoryId),
        games: []
      };

      groups.push(group);
    }

    group.games.push(game);
  });

  return groups;
}

function solangetrackerRenderStats(){
  const all = solangetrackerState.games.length;
  const active = solangetrackerState.games.filter(game => solangetrackerStatusKey(game.status) === "active").length;
  const closed = solangetrackerState.games.filter(game => solangetrackerStatusKey(game.status) === "closed").length;

  solangetrackerDom.stats.innerHTML = "";

  [
    ["Összes", all],
    ["Aktív", active],
    ["Lezárt", closed]
  ].forEach(item => {
    const stat = solangetrackerCreateEl("div", "solangetracker-stat");
    const key = solangetrackerCreateEl("div", "solangetracker-stat-k", item[0]);
    const val = solangetrackerCreateEl("div", "solangetracker-stat-v", item[1]);

    stat.appendChild(key);
    stat.appendChild(val);
    solangetrackerDom.stats.appendChild(stat);
  });
}

function solangetrackerInfoLine(label, value){
  const line = document.createElement("div");
  const b = document.createElement("b");

  b.textContent = `${label}: `;
  line.appendChild(b);
  line.appendChild(document.createTextNode(value));

  return line;
}

function solangetrackerRenderGame(game){
  const article = solangetrackerCreateEl("article", "solangetracker-game");

  if (game.id === solangetrackerState.selectedId) {
    article.classList.add("is-selected");
  }

  article.dataset.status = solangetrackerStatusKey(game.status);

  const imageWrap = solangetrackerCreateEl("div", "solangetracker-game-image");
  const image = document.createElement("img");

  solangetrackerSetImage(image, game.image);
  imageWrap.appendChild(image);

  const body = solangetrackerCreateEl("div", "solangetracker-game-body");

  const top = solangetrackerCreateEl("div", "solangetracker-game-top");
  const title = solangetrackerCreateEl("h3", "solangetracker-game-title", game.title || "Cím nélküli játék");
  const status = solangetrackerCreateEl("div", "solangetracker-status", solangetrackerStatusLabel(game.status));

  status.classList.add(`solangetracker-status-${solangetrackerStatusKey(game.status)}`);

  top.appendChild(title);
  top.appendChild(status);

  const info = solangetrackerCreateEl("div", "solangetracker-game-info");

  info.appendChild(solangetrackerInfoLine("Név", solangetrackerArray(game.characters).join(", ") || "-"));
  info.appendChild(solangetrackerInfoLine("Dátum", game.date || "-"));
  info.appendChild(solangetrackerInfoLine("Téma", game.topic || "-"));

  if (game.location) {
    info.appendChild(solangetrackerInfoLine("Helyszín", game.location));
  }

  const tags = solangetrackerCreateEl("div", "solangetracker-tags");

  solangetrackerArray(game.tags).forEach(tag => {
    tags.appendChild(solangetrackerCreateEl("span", "solangetracker-tag", tag));
  });

  const footer = solangetrackerCreateEl("div", "solangetracker-game-footer");

  const openBtn = solangetrackerCreateEl("button", "solangetracker-small-btn", "Megnézem");
  openBtn.type = "button";
  openBtn.addEventListener("click", () => {
    solangetrackerSelectGame(game.id);
  });

  footer.appendChild(openBtn);

  body.appendChild(top);
  body.appendChild(info);

  if (solangetrackerArray(game.tags).length > 0) {
    body.appendChild(tags);
  }

  body.appendChild(footer);

  article.appendChild(imageWrap);
  article.appendChild(body);

  return article;
}

function solangetrackerRenderList(){
  const filtered = solangetrackerGetFilteredGames();
  const groups = solangetrackerGroupByCategory(filtered);

  solangetrackerDom.list.innerHTML = "";
  solangetrackerDom.visibleCount.textContent = `${filtered.length} játék`;

  const hasAnyGame = filtered.length > 0;
  const hasSearchOrFilter = solangetrackerState.query.trim() !== "" || solangetrackerState.filter !== "all";

  solangetrackerDom.empty.classList.toggle("solangetracker-hidden", hasAnyGame || !hasSearchOrFilter);

  groups.forEach(group => {
    const details = solangetrackerCreateEl("details", "solangetracker-cat");

    if (solangetrackerState.openCategories.has(group.id)) {
      details.open = true;
    }

    details.addEventListener("toggle", () => {
      if (details.open) {
        solangetrackerState.openCategories.add(group.id);
      } else {
        solangetrackerState.openCategories.delete(group.id);
      }
    });

    const summary = document.createElement("summary");
    const name = solangetrackerCreateEl("span", "", group.category);
    const count = solangetrackerCreateEl("span", "solangetracker-cat-count", `${group.games.length} játék`);

    summary.appendChild(name);
    summary.appendChild(count);

    const body = solangetrackerCreateEl("div", "solangetracker-cat-body");

    if (group.games.length === 0) {
      body.appendChild(solangetrackerCreateEl("div", "solangetracker-empty", "Ebben a kategóriában még nincs játék."));
    } else {
      group.games.forEach(game => {
        body.appendChild(solangetrackerRenderGame(game));
      });
    }

    details.appendChild(summary);
    details.appendChild(body);

    solangetrackerDom.list.appendChild(details);
  });
}

function solangetrackerMetaBox(label, value){
  const box = solangetrackerCreateEl("div", "solangetracker-meta");

  box.appendChild(solangetrackerCreateEl("div", "solangetracker-meta-k", label));
  box.appendChild(solangetrackerCreateEl("div", "solangetracker-meta-v", value));

  return box;
}

function solangetrackerRenderReader(game){
  if (!game) {
    solangetrackerDom.reader.classList.add("solangetracker-hidden");
    solangetrackerDom.reader.innerHTML = "";
    return;
  }

  solangetrackerDom.reader.innerHTML = "";
  solangetrackerDom.reader.classList.remove("solangetracker-hidden");

  const grid = solangetrackerCreateEl("div", "solangetracker-reader-grid");

  const imageWrap = solangetrackerCreateEl("div", "solangetracker-reader-image");
  const image = document.createElement("img");

  solangetrackerSetImage(image, game.image);
  imageWrap.appendChild(image);

  const body = solangetrackerCreateEl("div", "solangetracker-reader-body");

  const top = solangetrackerCreateEl("div", "solangetracker-reader-top");

  const titleBlock = document.createElement("div");
  titleBlock.appendChild(solangetrackerCreateEl("div", "solangetracker-reader-label", solangetrackerStatusLabel(game.status)));
  titleBlock.appendChild(solangetrackerCreateEl("div", "solangetracker-reader-title", game.title || "Cím nélküli játék"));

  const closeBtn = solangetrackerCreateEl("button", "solangetracker-btn solangetracker-subtle", "Bezár");
  closeBtn.type = "button";
  closeBtn.addEventListener("click", () => {
    solangetrackerState.selectedId = null;
    solangetrackerRenderReader(null);
    solangetrackerRenderList();
  });

  top.appendChild(titleBlock);
  top.appendChild(closeBtn);

  const summary = solangetrackerCreateEl(
    "div",
    "solangetracker-reader-summary",
    game.summary || "Ehhez a játékhoz még nincs összefoglaló."
  );

  const meta = solangetrackerCreateEl("div", "solangetracker-reader-meta");

  meta.appendChild(solangetrackerMetaBox("Kategória", solangetrackerCategoryTitle(solangetrackerCategoryId(game))));
  meta.appendChild(solangetrackerMetaBox("Dátum", game.date || "-"));
  meta.appendChild(solangetrackerMetaBox("Szereplők", solangetrackerArray(game.characters).join(", ") || "-"));
  meta.appendChild(solangetrackerMetaBox("Téma", game.topic || "-"));

  if (game.location) {
    meta.appendChild(solangetrackerMetaBox("Helyszín", game.location));
  }

  if (solangetrackerArray(game.tags).length > 0) {
    meta.appendChild(solangetrackerMetaBox("Tagek", solangetrackerArray(game.tags).join(", ")));
  }

  const footer = solangetrackerCreateEl("div", "solangetracker-reader-footer");

  body.appendChild(top);
  body.appendChild(summary);
  body.appendChild(meta);
  body.appendChild(footer);

  grid.appendChild(imageWrap);
  grid.appendChild(body);

  solangetrackerDom.reader.appendChild(grid);
}

function solangetrackerSelectGame(id){
  const game = solangetrackerState.games.find(item => item.id === id);

  if (!game) {
    return;
  }

  solangetrackerState.selectedId = id;
  solangetrackerState.openCategories.add(solangetrackerCategoryId(game));

  solangetrackerRenderReader(game);
  solangetrackerRenderList();

  solangetrackerDom.reader.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function solangetrackerSetFilter(filter){
  solangetrackerState.filter = filter;

  solangetrackerDom.filters.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === filter);
  });

  solangetrackerRenderList();
}

function solangetrackerOpenAllCategories(){
  const groups = solangetrackerGroupByCategory(solangetrackerGetFilteredGames());

  groups.forEach(group => {
    solangetrackerState.openCategories.add(group.id);
  });

  solangetrackerRenderList();
}

function solangetrackerCloseAllCategories(){
  solangetrackerState.openCategories.clear();
  solangetrackerRenderList();
}

function solangetrackerApplyMeta(data){
  const meta = data.meta || {};

  solangetrackerDom.title.textContent = meta.title || "Solange Laveau";
  solangetrackerDom.subtitle.textContent = meta.subtitle || "játékkövető";
  solangetrackerDom.intro.textContent = meta.intro || "";

  if (solangetrackerDom.heroImage) {
    solangetrackerDom.heroImage.src = meta.heroImage || "images/snake2.jpg";
  }
}

function solangetrackerInitOpenCategories(){
  solangetrackerState.openCategories.clear();

  solangetrackerGetCategories().forEach(category => {
    if (category.open) {
      solangetrackerState.openCategories.add(category.id);
    }
  });
}

function solangetrackerInitEvents(){
  solangetrackerDom.search.addEventListener("input", event => {
    solangetrackerState.query = event.target.value;
    solangetrackerRenderList();
  });

  solangetrackerDom.filters.forEach(btn => {
    btn.addEventListener("click", () => {
      solangetrackerSetFilter(btn.dataset.filter);
    });
  });

  solangetrackerDom.openAll.addEventListener("click", solangetrackerOpenAllCategories);
  solangetrackerDom.closeAll.addEventListener("click", solangetrackerCloseAllCategories);
}

async function solangetrackerLoad(){
  try {
    const response = await fetch("solangetracker-data.json");

    if (!response.ok) {
      throw new Error("Nem sikerült betölteni a JSON fájlt.");
    }

    const data = await response.json();

    solangetrackerState.data = data;
    solangetrackerState.games = Array.isArray(data.games) ? data.games : [];

    solangetrackerApplyMeta(data);
    solangetrackerInitOpenCategories();
    solangetrackerRenderStats();
    solangetrackerRenderList();
  } catch (error) {
    solangetrackerDom.visibleCount.textContent = "0 játék";
    solangetrackerDom.empty.textContent = "Nem sikerült betölteni a solangetracker-data.json fájlt.";
    solangetrackerDom.empty.classList.remove("solangetracker-hidden");
  }
}

solangetrackerInitEvents();
solangetrackerLoad();