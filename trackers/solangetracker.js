const solangetrackerState = {
  data: null,
  games: [],
  filter: "all",
  query: "",
  selectedId: null,
  selectedCharacter: null,
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
  scrollbox: document.getElementById("solangetrackerScrollbox"),
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

function solangetrackerDefaultCharacterImage(){
  return solangetrackerState.data?.meta?.defaultCharacterImage || solangetrackerDefaultImage();
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

function solangetrackerSetImage(img, src, fallback){
  const safeFallback = fallback || solangetrackerDefaultImage();

  img.src = src || safeFallback;
  img.alt = "";

  img.addEventListener("error", () => {
    img.src = safeFallback;
  }, { once: true });
}

function solangetrackerHasLink(game){
  return typeof game.link === "string" && game.link.trim() !== "";
}

function solangetrackerMakeExternalLink(game, text, className){
  const link = document.createElement("a");

  link.className = className;
  link.textContent = text;
  link.href = game.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  return link;
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

function solangetrackerCharacterName(character){
  if (typeof character === "string") {
    return character;
  }

  if (character && typeof character === "object") {
    return character.name || character.title || character.id || "Ismeretlen";
  }

  return "";
}

function solangetrackerCharacterBankItem(name){
  const bank = solangetrackerState.data?.characters || solangetrackerState.data?.characterBank || null;

  if (!bank || !name) {
    return null;
  }

  if (Array.isArray(bank)) {
    return bank.find(item => {
      const itemName = item?.name || item?.title || item?.id || "";
      return solangetrackerNormalize(itemName) === solangetrackerNormalize(name);
    }) || null;
  }

  if (typeof bank === "object") {
    const direct = bank[name];

    if (typeof direct === "string") {
      return {
        image: direct
      };
    }

    if (direct && typeof direct === "object") {
      return direct;
    }

    const normalizedName = solangetrackerNormalize(name);
    const matchingKey = Object.keys(bank).find(key => solangetrackerNormalize(key) === normalizedName);

    if (matchingKey) {
      const match = bank[matchingKey];

      if (typeof match === "string") {
        return {
          image: match
        };
      }

      if (match && typeof match === "object") {
        return match;
      }
    }
  }

  return null;
}

function solangetrackerCharacterImage(character){
  const name = solangetrackerCharacterName(character);
  const bankItem = solangetrackerCharacterBankItem(name);

  if (character && typeof character === "object") {
    return character.image || character.avatar || character.photo || bankItem?.image || bankItem?.avatar || bankItem?.photo || "";
  }

  return bankItem?.image || bankItem?.avatar || bankItem?.photo || "";
}

function solangetrackerCharacterFeatured(character, game){
  const name = solangetrackerCharacterName(character);
  const normalizedName = solangetrackerNormalize(name);

  const characterMarked = character && typeof character === "object" && (
    character.featured === true ||
    character.highlighted === true ||
    character.important === true
  );

  const featuredLists = [
    ...solangetrackerArray(game.featuredCharacters),
    ...solangetrackerArray(game.highlightedCharacters),
    ...solangetrackerArray(game.importantCharacters)
  ];

  const listed = featuredLists.some(item => solangetrackerNormalize(solangetrackerCharacterName(item) || item) === normalizedName);

  return characterMarked || listed;
}

function solangetrackerCharacterNames(game){
  return solangetrackerArray(game.characters)
    .map(character => solangetrackerCharacterName(character))
    .filter(name => name);
}

function solangetrackerSameCharacterName(firstName, secondName){
  return solangetrackerNormalize(firstName) === solangetrackerNormalize(secondName);
}

function solangetrackerGameHasCharacter(game, characterName){
  if (!characterName) {
    return false;
  }

  return solangetrackerArray(game.characters).some(character => {
    return solangetrackerSameCharacterName(solangetrackerCharacterName(character), characterName);
  });
}

function solangetrackerGetCharacterGames(characterName){
  return solangetrackerState.games.filter(game => solangetrackerGameHasCharacter(game, characterName));
}

function solangetrackerFindCharacterByName(characterName){
  if (!characterName) {
    return null;
  }

  for (const game of solangetrackerState.games) {
    for (const character of solangetrackerArray(game.characters)) {
      if (solangetrackerSameCharacterName(solangetrackerCharacterName(character), characterName) && solangetrackerCharacterImage(character)) {
        return character;
      }
    }
  }

  return null;
}

function solangetrackerCharacterImageForName(characterName, preferredCharacter){
  const preferredImage = solangetrackerCharacterImage(preferredCharacter);

  if (preferredImage) {
    return preferredImage;
  }

  return solangetrackerCharacterImage(solangetrackerFindCharacterByName(characterName));
}

function solangetrackerRenderCharacters(game, variant){
  const characters = solangetrackerArray(game.characters);

  if (characters.length === 0) {
    return null;
  }

  const wrap = solangetrackerCreateEl("div", `solangetracker-character-list solangetracker-character-list-${variant || "card"}`);

  characters.forEach(character => {
    const name = solangetrackerCharacterName(character);

    if (!name) {
      return;
    }

    const chip = solangetrackerCreateEl("button", "solangetracker-character-chip");
    chip.type = "button";

    if (solangetrackerState.selectedCharacter && solangetrackerSameCharacterName(solangetrackerState.selectedCharacter.name, name)) {
      chip.classList.add("is-active-character");
    }

    if (solangetrackerCharacterFeatured(character, game)) {
      chip.classList.add("is-featured");
    }

    chip.title = name;
    chip.setAttribute("aria-label", name);
    chip.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      solangetrackerSelectCharacter(character);
    });

    const img = document.createElement("img");
    solangetrackerSetImage(img, solangetrackerCharacterImage(character), solangetrackerDefaultCharacterImage());
    img.alt = name;

    const label = solangetrackerCreateEl("span", "solangetracker-character-name", name);

    chip.appendChild(img);
    chip.appendChild(label);
    wrap.appendChild(chip);
  });

  return wrap;
}

function solangetrackerRenderTags(tags, className){
  const tagList = solangetrackerArray(tags);

  if (tagList.length === 0) {
    return null;
  }

  const wrap = solangetrackerCreateEl("div", className || "solangetracker-tags");

  tagList.forEach(tag => {
    wrap.appendChild(solangetrackerCreateEl("span", "solangetracker-tag", tag));
  });

  return wrap;
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
    solangetrackerCharacterNames(game).join(" "),
    solangetrackerArray(game.tags).join(" ")
  ];

  return solangetrackerNormalize(parts.join(" "));
}

function solangetrackerGetFilteredGames(){
  const query = solangetrackerNormalize(solangetrackerState.query);
  const selectedCharacterName = solangetrackerState.selectedCharacter?.name || "";

  return solangetrackerState.games.filter(game => {
    const statusOk = solangetrackerState.filter === "all" || solangetrackerStatusKey(game.status) === solangetrackerState.filter;
    const queryOk = !query || solangetrackerSearchBlob(game).includes(query);
    const characterOk = !selectedCharacterName || solangetrackerGameHasCharacter(game, selectedCharacterName);

    return statusOk && queryOk && characterOk;
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

  info.appendChild(solangetrackerInfoLine("Dátum", game.date || "-"));

  if (game.location) {
    info.appendChild(solangetrackerInfoLine("Helyszín", game.location));
  }

  const characters = solangetrackerRenderCharacters(game, "card");
  const tags = solangetrackerRenderTags(game.tags, "solangetracker-tags");

  const footer = solangetrackerCreateEl("div", "solangetracker-game-footer");

  const detailsBtn = solangetrackerCreateEl("button", "solangetracker-small-btn", "Részletek");
  detailsBtn.type = "button";
  detailsBtn.addEventListener("click", () => {
    solangetrackerSelectGame(game.id);
  });

  footer.appendChild(detailsBtn);

  if (solangetrackerHasLink(game)) {
    footer.appendChild(solangetrackerMakeExternalLink(game, "Megnyitás", "solangetracker-small-btn solangetracker-small-link"));
  }

  body.appendChild(top);
  body.appendChild(info);

  if (characters) {
    const characterBlock = solangetrackerCreateEl("div", "solangetracker-game-characters");
    characterBlock.appendChild(solangetrackerCreateEl("div", "solangetracker-game-characters-label", "Szereplők"));
    characterBlock.appendChild(characters);
    body.appendChild(characterBlock);
  }

  if (tags) {
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
  const hasCharacterFilter = !!solangetrackerState.selectedCharacter;

  solangetrackerDom.list.innerHTML = "";
  solangetrackerDom.visibleCount.textContent = hasCharacterFilter
    ? `${filtered.length} játék (${solangetrackerState.selectedCharacter.name})`
    : `${filtered.length} játék`;

  const hasAnyGame = filtered.length > 0;
  const hasSearchOrFilter = solangetrackerState.query.trim() !== "" || solangetrackerState.filter !== "all" || hasCharacterFilter;

  solangetrackerDom.empty.classList.toggle("solangetracker-hidden", hasAnyGame || !hasSearchOrFilter);

  groups.forEach(group => {
    if (group.games.length === 0 && hasSearchOrFilter) {
      return;
    }

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

function solangetrackerMetaBox(label, value, extraClass){
  const box = solangetrackerCreateEl("div", "solangetracker-meta");

  if (extraClass) {
    box.classList.add(extraClass);
  }

  const body = solangetrackerCreateEl("div", "solangetracker-meta-v");

  box.appendChild(solangetrackerCreateEl("div", "solangetracker-meta-k", label));

  if (value instanceof Node) {
    body.appendChild(value);
  } else {
    body.textContent = value;
  }

  box.appendChild(body);

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
  const readerCharacters = solangetrackerRenderCharacters(game, "reader");
  const readerTags = solangetrackerRenderTags(game.tags, "solangetracker-tags solangetracker-reader-tags");

  meta.appendChild(solangetrackerMetaBox("Kategória", solangetrackerCategoryTitle(solangetrackerCategoryId(game))));
  meta.appendChild(solangetrackerMetaBox("Dátum", game.date || "-"));

  if (readerCharacters) {
    meta.appendChild(solangetrackerMetaBox("Szereplők", readerCharacters));
  }

  if (game.location) {
    meta.appendChild(solangetrackerMetaBox("Helyszín", game.location));
  }

  if (readerTags) {
    meta.appendChild(solangetrackerMetaBox("Tagek", readerTags, "solangetracker-meta-full"));
  }

  const footer = solangetrackerCreateEl("div", "solangetracker-reader-footer");

  if (solangetrackerHasLink(game)) {
    footer.appendChild(solangetrackerMakeExternalLink(game, "Megnyitás", "solangetracker-link solangetracker-reader-link"));
  }

  body.appendChild(top);
  body.appendChild(summary);
  body.appendChild(meta);
  body.appendChild(footer);

  grid.appendChild(imageWrap);
  grid.appendChild(body);

  solangetrackerDom.reader.appendChild(grid);
}

function solangetrackerRenderCharacterReader(character){
  if (!character?.name) {
    solangetrackerDom.reader.classList.add("solangetracker-hidden");
    solangetrackerDom.reader.innerHTML = "";
    return;
  }

  const allGames = solangetrackerGetCharacterGames(character.name);
  const visibleGames = solangetrackerGetFilteredGames();
  const imageSrc = solangetrackerCharacterImageForName(character.name, character);

  solangetrackerDom.reader.innerHTML = "";
  solangetrackerDom.reader.classList.remove("solangetracker-hidden");

  const wrap = solangetrackerCreateEl("div", "solangetracker-character-reader");
  const imageWrap = solangetrackerCreateEl("div", "solangetracker-character-reader-image");
  const image = document.createElement("img");

  solangetrackerSetImage(image, imageSrc, solangetrackerDefaultCharacterImage());
  image.alt = character.name;
  imageWrap.appendChild(image);

  const body = solangetrackerCreateEl("div", "solangetracker-character-reader-body");
  const top = solangetrackerCreateEl("div", "solangetracker-reader-top");
  const titleBlock = document.createElement("div");

  titleBlock.appendChild(solangetrackerCreateEl("div", "solangetracker-reader-label", "Karakter"));
  titleBlock.appendChild(solangetrackerCreateEl("div", "solangetracker-reader-title", character.name));

  const closeBtn = solangetrackerCreateEl("button", "solangetracker-btn solangetracker-subtle", "Szűrés törlése");
  closeBtn.type = "button";
  closeBtn.addEventListener("click", () => {
    solangetrackerState.selectedCharacter = null;
    solangetrackerRenderReader(null);
    solangetrackerRenderList();
  });

  top.appendChild(titleBlock);
  top.appendChild(closeBtn);

  const countText = visibleGames.length === allGames.length
    ? `${allGames.length} játékban szerepel.`
    : `${visibleGames.length} játék látszik a jelenlegi szűrőkkel, összesen ${allGames.length} játékban szerepel.`;

  const summary = solangetrackerCreateEl(
    "div",
    "solangetracker-reader-summary",
    `${countText} Az alábbi lista csak azokat a játékokat jeleníti meg, amikben a megjelölt karakter szerepel. A szűrő törlésével lehet visszaállítani alapértelmezettre.`
  );

  body.appendChild(top);
  body.appendChild(summary);
  wrap.appendChild(imageWrap);
  wrap.appendChild(body);

  solangetrackerDom.reader.appendChild(wrap);
}

function solangetrackerRefreshCharacterReader(){
  if (solangetrackerState.selectedCharacter) {
    solangetrackerRenderCharacterReader(solangetrackerState.selectedCharacter);
  }
}

function solangetrackerSelectCharacter(character){
  const name = solangetrackerCharacterName(character);

  if (!name) {
    return;
  }

  const image = solangetrackerCharacterImageForName(name, character);

  solangetrackerState.selectedId = null;
  solangetrackerState.selectedCharacter = { name, image };
  solangetrackerState.filter = "all";
  solangetrackerState.query = "";
  solangetrackerDom.search.value = "";

  solangetrackerDom.filters.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === "all");
  });

  solangetrackerGetCharacterGames(name).forEach(game => {
    solangetrackerState.openCategories.add(solangetrackerCategoryId(game));
  });

  solangetrackerRenderCharacterReader(solangetrackerState.selectedCharacter);
  solangetrackerRenderList();

  if (solangetrackerDom.scrollbox) {
    solangetrackerDom.scrollbox.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    solangetrackerDom.reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function solangetrackerSelectGame(id){
  const game = solangetrackerState.games.find(item => item.id === id);

  if (!game) {
    return;
  }

  solangetrackerState.selectedId = id;
  solangetrackerState.selectedCharacter = null;
  solangetrackerState.openCategories.add(solangetrackerCategoryId(game));

  solangetrackerRenderReader(game);
  solangetrackerRenderList();

  if (solangetrackerDom.scrollbox) {
    solangetrackerDom.scrollbox.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    solangetrackerDom.reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function solangetrackerSetFilter(filter){
  solangetrackerState.filter = filter;

  solangetrackerDom.filters.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === filter);
  });

  solangetrackerRefreshCharacterReader();
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
    solangetrackerRefreshCharacterReader();
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