const barelytrackerState = {
  data: null,
  games: [],
  filter: "all",
  query: "",
  selectedId: null,
  openCategories: new Set()
};

const barelytrackerDom = {
  initial: document.getElementById("barelytrackerInitial"),
  icons: document.getElementById("barelytrackerIcons"),
  motto: document.getElementById("barelytrackerMotto"),
  frame: document.getElementById("barelytrackerFrame"),
  title: document.getElementById("barelytrackerTitle"),
  subtitle: document.getElementById("barelytrackerSubtitle"),
  intro: document.getElementById("barelytrackerIntro"),
  search: document.getElementById("barelytrackerSearch"),
  filters: document.querySelectorAll(".barelytracker-filter"),
  openAll: document.getElementById("barelytrackerOpenAll"),
  closeAll: document.getElementById("barelytrackerCloseAll"),
  reader: document.getElementById("barelytrackerReader"),
  list: document.getElementById("barelytrackerList"),
  empty: document.getElementById("barelytrackerEmpty"),
  visibleCount: document.getElementById("barelytrackerVisibleCount")
};

const barelytrackerStatus = {
  active: "Aktív",
  closed: "Lezárt",
  paused: "Szünetel",
  planned: "Tervezett",
  stuck: "Elakadt"
};

const barelytrackerStatusAliases = {
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

function barelytrackerNormalize(value){
  return String(value || "")
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function barelytrackerArray(value){
  return Array.isArray(value) ? value : [];
}

function barelytrackerCreateEl(tag, className, text){
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  if (text !== undefined && text !== null) {
    el.textContent = text;
  }

  return el;
}

function barelytrackerStatusKey(status){
  const key = barelytrackerNormalize(status).replace(/\s+/g, "-");
  return barelytrackerStatusAliases[key] || key || "unknown";
}

function barelytrackerStatusLabel(status){
  const key = barelytrackerStatusKey(status);
  return barelytrackerStatus[key] || status || "Ismeretlen";
}

function barelytrackerDefaultImage(){
  return barelytrackerState.data?.meta?.defaultImage || "https://i.imgur.com/6Syolw9.jpeg";
}

function barelytrackerDefaultCharacterImage(){
  return barelytrackerState.data?.meta?.defaultCharacterImage || barelytrackerDefaultImage();
}

function barelytrackerSetImage(img, src, fallback){
  const safeFallback = fallback || barelytrackerDefaultImage();
  img.src = src || safeFallback;
  img.alt = "";
  img.addEventListener("error", () => {
    if (img.src !== safeFallback) {
      img.src = safeFallback;
    }
  }, { once: true });
}

function barelytrackerHasLink(game){
  return typeof game.link === "string" && game.link.trim() !== "";
}

function barelytrackerMakeExternalLink(game, text, className){
  const link = document.createElement("a");
  link.className = className;
  link.textContent = text;
  link.href = game.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function barelytrackerCategoryId(game){
  return game.categoryId || game.category || "other";
}

function barelytrackerGetCategories(){
  const categories = barelytrackerState.data?.categories;

  if (Array.isArray(categories) && categories.length > 0) {
    return categories;
  }

  const seen = new Set();
  return barelytrackerState.games
    .map(game => barelytrackerCategoryId(game))
    .filter(id => {
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    })
    .map(id => ({ id, title: id, open: false }));
}

function barelytrackerCategoryTitle(categoryId){
  const category = barelytrackerGetCategories().find(item => item.id === categoryId);
  return category?.title || categoryId || "Egyéb";
}

function barelytrackerCharacterName(character){
  if (typeof character === "string") {
    return character;
  }

  if (character && typeof character === "object") {
    return character.name || character.title || character.id || "Ismeretlen";
  }

  return "";
}

function barelytrackerCharacterBankItem(name){
  const bank = barelytrackerState.data?.characters || barelytrackerState.data?.characterBank || null;

  if (!bank || !name) {
    return null;
  }

  if (Array.isArray(bank)) {
    return bank.find(item => {
      const itemName = item?.name || item?.title || item?.id || "";
      return barelytrackerNormalize(itemName) === barelytrackerNormalize(name);
    }) || null;
  }

  if (typeof bank === "object") {
    const direct = bank[name];

    if (typeof direct === "string") {
      return { image: direct };
    }

    if (direct && typeof direct === "object") {
      return direct;
    }

    const normalizedName = barelytrackerNormalize(name);
    const matchingKey = Object.keys(bank).find(key => barelytrackerNormalize(key) === normalizedName);

    if (matchingKey) {
      const match = bank[matchingKey];
      return typeof match === "string" ? { image: match } : match;
    }
  }

  return null;
}

function barelytrackerCharacterImage(character){
  const name = barelytrackerCharacterName(character);
  const bankItem = barelytrackerCharacterBankItem(name);

  if (character && typeof character === "object") {
    return character.image || character.avatar || character.photo || bankItem?.image || bankItem?.avatar || bankItem?.photo || "";
  }

  return bankItem?.image || bankItem?.avatar || bankItem?.photo || "";
}

function barelytrackerCharacterFeatured(character, game){
  const name = barelytrackerCharacterName(character);
  const normalizedName = barelytrackerNormalize(name);
  const characterMarked = character && typeof character === "object" && (
    character.featured === true ||
    character.highlighted === true ||
    character.important === true
  );

  const featuredLists = [
    ...barelytrackerArray(game.featuredCharacters),
    ...barelytrackerArray(game.highlightedCharacters),
    ...barelytrackerArray(game.importantCharacters)
  ];

  const listed = featuredLists.some(item => barelytrackerNormalize(barelytrackerCharacterName(item) || item) === normalizedName);
  return characterMarked || listed;
}

function barelytrackerCharacterNames(game){
  return barelytrackerArray(game.characters)
    .map(character => barelytrackerCharacterName(character))
    .filter(name => name);
}

function barelytrackerRenderCharacters(game){
  const characters = barelytrackerArray(game.characters);

  if (characters.length === 0) {
    return null;
  }

  const wrap = barelytrackerCreateEl("div", "barelytracker-character-list");

  characters.forEach(character => {
    const name = barelytrackerCharacterName(character);

    if (!name) {
      return;
    }

    const chip = barelytrackerCreateEl("div", "barelytracker-character-chip");

    if (barelytrackerCharacterFeatured(character, game)) {
      chip.classList.add("is-featured");
    }

    chip.title = name;
    chip.setAttribute("aria-label", name);

    const img = document.createElement("img");
    barelytrackerSetImage(img, barelytrackerCharacterImage(character), barelytrackerDefaultCharacterImage());
    img.alt = name;

    const label = barelytrackerCreateEl("span", "barelytracker-character-name", name);
    chip.appendChild(img);
    chip.appendChild(label);
    wrap.appendChild(chip);
  });

  return wrap;
}

function barelytrackerSearchBlob(game){
  const metaValues = game.meta && typeof game.meta === "object" ? Object.values(game.meta).join(" ") : "";
  const parts = [
    game.title,
    barelytrackerCategoryTitle(barelytrackerCategoryId(game)),
    game.status,
    barelytrackerStatusLabel(game.status),
    game.name,
    game.topic,
    game.date,
    game.location,
    game.triggerWarning,
    game.summary,
    metaValues,
    barelytrackerCharacterNames(game).join(" ")
  ];

  return barelytrackerNormalize(parts.join(" "));
}

function barelytrackerGetFilteredGames(){
  const query = barelytrackerNormalize(barelytrackerState.query);

  return barelytrackerState.games.filter(game => {
    const statusOk = barelytrackerState.filter === "all" || barelytrackerStatusKey(game.status) === barelytrackerState.filter;
    const queryOk = !query || barelytrackerSearchBlob(game).includes(query);
    return statusOk && queryOk;
  });
}

function barelytrackerGroupByCategory(games){
  const categories = barelytrackerGetCategories();
  const groups = categories.map(category => ({ id: category.id, category: category.title, games: [] }));

  games.forEach(game => {
    const categoryId = barelytrackerCategoryId(game);
    let group = groups.find(item => item.id === categoryId);

    if (!group) {
      group = { id: categoryId, category: barelytrackerCategoryTitle(categoryId), games: [] };
      groups.push(group);
    }

    group.games.push(game);
  });

  return groups;
}

function barelytrackerInfoLine(label, value){
  const line = document.createElement("div");
  const b = document.createElement("b");
  b.textContent = `${label}: `;
  line.appendChild(b);
  line.appendChild(document.createTextNode(value || "-"));
  return line;
}

function barelytrackerRenderGame(game){
  const article = barelytrackerCreateEl("article", "barelytracker-game");

  if (game.id === barelytrackerState.selectedId) {
    article.classList.add("is-selected");
  }

  article.dataset.status = barelytrackerStatusKey(game.status);

  const thumb = barelytrackerCreateEl("div", "barelytracker-game-thumb");
  const image = document.createElement("img");
  barelytrackerSetImage(image, game.image);
  thumb.appendChild(image);

  if (game.triggerWarning) {
    const tw = barelytrackerCreateEl("span", "barelytracker-tw", "TW");
    tw.title = game.triggerWarning;
    thumb.appendChild(tw);
  }

  thumb.appendChild(barelytrackerCreateEl("span", "barelytracker-pill", barelytrackerStatusLabel(game.status)));

  const body = barelytrackerCreateEl("div", "barelytracker-game-body");
  body.appendChild(barelytrackerCreateEl("div", "barelytracker-game-title", game.title || "Cím nélküli játék"));

  const meta = barelytrackerCreateEl("div", "barelytracker-meta");

  if (game.name) {
    meta.appendChild(barelytrackerInfoLine("Név", game.name));
  }

  if (game.topic) {
    meta.appendChild(barelytrackerInfoLine("Téma", game.topic));
  }

  if (game.date) {
    meta.appendChild(barelytrackerInfoLine("Dátum", game.date));
  }

  if (game.location) {
    meta.appendChild(barelytrackerInfoLine("Helyszín", game.location));
  }

  body.appendChild(meta);

  const characters = barelytrackerRenderCharacters(game);

  if (characters) {
    const block = barelytrackerCreateEl("div", "barelytracker-characters");
    block.appendChild(barelytrackerCreateEl("div", "barelytracker-characters-label", "Szereplők"));
    block.appendChild(characters);
    body.appendChild(block);
  }

  const footer = barelytrackerCreateEl("div", "barelytracker-game-footer");
  const detailsBtn = barelytrackerCreateEl("button", "barelytracker-small-btn", "Részletek");
  detailsBtn.type = "button";
  detailsBtn.addEventListener("click", () => {
    barelytrackerSelectGame(game.id);
  });
  footer.appendChild(detailsBtn);

  if (barelytrackerHasLink(game)) {
    footer.appendChild(barelytrackerMakeExternalLink(game, "Megnyitás", "barelytracker-link"));
  }

  body.appendChild(footer);
  article.appendChild(thumb);
  article.appendChild(body);
  return article;
}

function barelytrackerRenderList(){
  const filtered = barelytrackerGetFilteredGames();
  const groups = barelytrackerGroupByCategory(filtered);
  const hasSearchOrFilter = barelytrackerState.query.trim() !== "" || barelytrackerState.filter !== "all";

  barelytrackerDom.list.innerHTML = "";
  barelytrackerDom.visibleCount.textContent = `${filtered.length} játék`;
  barelytrackerDom.empty.classList.toggle("barelytracker-hidden", filtered.length > 0 || !hasSearchOrFilter);

  groups.forEach(group => {
    if (group.games.length === 0 && hasSearchOrFilter) {
      return;
    }

    const details = barelytrackerCreateEl("details", "barelytracker-cat");

    if (barelytrackerState.openCategories.has(group.id)) {
      details.open = true;
    }

    details.addEventListener("toggle", () => {
      if (details.open) {
        barelytrackerState.openCategories.add(group.id);
      } else {
        barelytrackerState.openCategories.delete(group.id);
      }
    });

    const summary = document.createElement("summary");
    summary.appendChild(barelytrackerCreateEl("span", "barelytracker-cat-name", group.category));
    summary.appendChild(barelytrackerCreateEl("span", "barelytracker-cat-count", `${group.games.length} játék`));

    const body = barelytrackerCreateEl("div", "barelytracker-list");

    if (group.games.length === 0) {
      body.appendChild(barelytrackerCreateEl("div", "barelytracker-empty", "Ebben a kategóriában még nincs játék."));
    } else {
      group.games.forEach(game => {
        body.appendChild(barelytrackerRenderGame(game));
      });
    }

    details.appendChild(summary);
    details.appendChild(body);
    barelytrackerDom.list.appendChild(details);
  });
}

function barelytrackerRenderReader(game){
  if (!game) {
    barelytrackerDom.reader.classList.add("barelytracker-hidden");
    barelytrackerDom.reader.innerHTML = "";
    return;
  }

  barelytrackerDom.reader.innerHTML = "";
  barelytrackerDom.reader.classList.remove("barelytracker-hidden");

  const grid = barelytrackerCreateEl("div", "barelytracker-reader-grid");
  const imageWrap = barelytrackerCreateEl("div", "barelytracker-reader-image");
  const image = document.createElement("img");
  barelytrackerSetImage(image, game.image);
  imageWrap.appendChild(image);

  const body = barelytrackerCreateEl("div", "barelytracker-reader-body");
  const top = barelytrackerCreateEl("div", "barelytracker-reader-top");
  const titleBlock = document.createElement("div");
  titleBlock.appendChild(barelytrackerCreateEl("div", "barelytracker-reader-label", barelytrackerStatusLabel(game.status)));
  titleBlock.appendChild(barelytrackerCreateEl("div", "barelytracker-reader-title", game.title || "Cím nélküli játék"));

  const closeBtn = barelytrackerCreateEl("button", "barelytracker-btn", "Bezár");
  closeBtn.type = "button";
  closeBtn.addEventListener("click", () => {
    barelytrackerState.selectedId = null;
    barelytrackerRenderReader(null);
    barelytrackerRenderList();
  });

  top.appendChild(titleBlock);
  top.appendChild(closeBtn);

  const summaryText = game.summary || "Ehhez a játékhoz még nincs külön leírás megadva. A mező a JSON-ban tölthető ki.";
  const summary = barelytrackerCreateEl("div", "barelytracker-reader-summary", summaryText);
  const meta = barelytrackerCreateEl("div", "barelytracker-reader-meta");

  meta.appendChild(barelytrackerInfoLine("Kategória", barelytrackerCategoryTitle(barelytrackerCategoryId(game))));

  if (game.name) {
    meta.appendChild(barelytrackerInfoLine("Név", game.name));
  }

  if (game.topic) {
    meta.appendChild(barelytrackerInfoLine("Téma", game.topic));
  }

  if (game.date) {
    meta.appendChild(barelytrackerInfoLine("Dátum", game.date));
  }

  if (game.location) {
    meta.appendChild(barelytrackerInfoLine("Helyszín", game.location));
  }

  if (game.triggerWarning) {
    meta.appendChild(barelytrackerInfoLine("TW", game.triggerWarning));
  }

  const characters = barelytrackerRenderCharacters(game);

  if (characters) {
    const characterBox = document.createElement("div");
    const label = document.createElement("b");
    label.textContent = "Szereplők: ";
    characterBox.appendChild(label);
    characterBox.appendChild(characters);
    meta.appendChild(characterBox);
  }

  const footer = barelytrackerCreateEl("div", "barelytracker-reader-footer");

  if (barelytrackerHasLink(game)) {
    footer.appendChild(barelytrackerMakeExternalLink(game, "Megnyitás", "barelytracker-link"));
  }

  body.appendChild(top);
  body.appendChild(summary);
  body.appendChild(meta);
  body.appendChild(footer);
  grid.appendChild(imageWrap);
  grid.appendChild(body);
  barelytrackerDom.reader.appendChild(grid);
}

function barelytrackerSelectGame(id){
  const game = barelytrackerState.games.find(item => item.id === id);

  if (!game) {
    return;
  }

  barelytrackerState.selectedId = id;
  barelytrackerState.openCategories.add(barelytrackerCategoryId(game));
  barelytrackerRenderReader(game);
  barelytrackerRenderList();
  barelytrackerDom.reader.scrollIntoView({ behavior: "smooth", block: "start" });
}

function barelytrackerSetFilter(filter){
  barelytrackerState.filter = filter;

  barelytrackerDom.filters.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === filter);
  });

  barelytrackerRenderList();
}

function barelytrackerOpenAllCategories(){
  const groups = barelytrackerGroupByCategory(barelytrackerGetFilteredGames());
  groups.forEach(group => barelytrackerState.openCategories.add(group.id));
  barelytrackerRenderList();
}

function barelytrackerCloseAllCategories(){
  barelytrackerState.openCategories.clear();
  barelytrackerRenderList();
}

function barelytrackerApplyMeta(data){
  const meta = data.meta || {};
  barelytrackerDom.initial.textContent = meta.initial || "B";
  barelytrackerDom.motto.textContent = meta.motto || "barely human";
  barelytrackerDom.title.textContent = meta.title || "Játéklista";
  barelytrackerDom.subtitle.textContent = meta.subtitle || "játékkövető";
  barelytrackerDom.intro.textContent = meta.intro || "";

  if (meta.frameImage) {
    barelytrackerDom.frame.style.backgroundImage = `url(${meta.frameImage})`;
  }

  barelytrackerDom.icons.innerHTML = "";
  barelytrackerArray(meta.iconImages).forEach(src => {
    const img = document.createElement("img");
    img.alt = "";
    img.src = src;
    barelytrackerDom.icons.appendChild(img);
  });
}

function barelytrackerInitOpenCategories(){
  barelytrackerState.openCategories.clear();
  barelytrackerGetCategories().forEach(category => {
    if (category.open) {
      barelytrackerState.openCategories.add(category.id);
    }
  });
}

function barelytrackerInitEvents(){
  barelytrackerDom.search.addEventListener("input", event => {
    barelytrackerState.query = event.target.value;
    barelytrackerRenderList();
  });

  barelytrackerDom.filters.forEach(btn => {
    btn.addEventListener("click", () => {
      barelytrackerSetFilter(btn.dataset.filter);
    });
  });

  barelytrackerDom.openAll.addEventListener("click", barelytrackerOpenAllCategories);
  barelytrackerDom.closeAll.addEventListener("click", barelytrackerCloseAllCategories);
}

async function barelytrackerLoad(){
  try {
    const response = await fetch("barelytracker-data.json");

    if (!response.ok) {
      throw new Error("Nem sikerült betölteni a JSON fájlt.");
    }

    const data = await response.json();
    barelytrackerState.data = data;
    barelytrackerState.games = Array.isArray(data.games) ? data.games : [];
    barelytrackerApplyMeta(data);
    barelytrackerInitOpenCategories();
    barelytrackerRenderList();
  } catch (error) {
    barelytrackerDom.visibleCount.textContent = "0 játék";
    barelytrackerDom.empty.textContent = "Nem sikerült betölteni a barelytracker-data.json fájlt.";
    barelytrackerDom.empty.classList.remove("barelytracker-hidden");
  }
}

barelytrackerInitEvents();
barelytrackerLoad();
