const STORAGE_KEY = "rpg-family-tree-data-v3.4";
const OLD_STORAGE_KEYS = [];
const DEFAULT_DATA_URL = "data/family.json";
const CARD_W = 304;
const CARD_H = 356;
const GAP_X = 96;
const GAP_Y = 160;
const FIREBASE_SDK_VERSION = "11.10.0";

let data = null;
let selectedId = null;
let selectedAnnotationId = null;
let selectedEventId = null;
let selectedLinkKey = null;
let suppressCardClickId = null;
let activeView = "tree";
let zoom = 1;
let positions = new Map();
let firebaseState = {
  ready: false,
  modules: null,
  config: null,
  app: null,
  db: null,
  ref: null,
  auth: null,
  authEnabled: false,
  user: null,
  unsubscribe: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const stageScroll = $("#stageScroll");
const stageSpace = $("#stageSpace");
const stage = $("#stage");
const cards = $("#cards");
const links = $("#links");
const annotationsLayer = $("#annotations");
const form = $("#personForm");
const annotationForm = $("#annotationForm");
const eventForm = $("#eventForm");
const linkStyleForm = $("#linkStyleForm");

init();

async function init() {
  bindUi();
  await loadData();
  if (data.people.length && !selectedId) selectedId = data.people[0].id;
  if (data.annotations.length && !selectedAnnotationId) selectedAnnotationId = data.annotations[0].id;
  if (data.events.length && !selectedEventId) selectedEventId = data.events[0].id;
  render();
}

async function loadData() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("data") || DEFAULT_DATA_URL;
  const saved = localStorage.getItem(STORAGE_KEY) || OLD_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);

  if (saved && !params.has("fresh")) {
    data = normalize(JSON.parse(saved));
    return;
  }

  try {
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = normalize(await response.json());
  } catch {
    data = normalize(emptyTreeData());
  }
}

function emptyTreeData() {
  return {
    meta: {
      title: "RPG családfa",
      subtitle: "Üres családfa – kezdd új szereplővel vagy tölts be felhőből / JSON-ból.",
      currentYear: 2032
    },
    people: [],
    relationships: [],
    linkStyles: { parent: {} },
    annotations: [],
    events: []
  };
}

function normalize(input) {
  const normalized = {
    meta: {
      title: input?.meta?.title || "RPG családfa",
      subtitle: input?.meta?.subtitle || "",
      currentYear: numberOrBlank(input?.meta?.currentYear) || 2032
    },
    people: Array.isArray(input?.people) ? input.people : [],
    relationships: Array.isArray(input?.relationships) ? input.relationships : [],
    linkStyles: normalizeLinkStyles(input?.linkStyles),
    annotations: Array.isArray(input?.annotations) ? input.annotations : [],
    events: Array.isArray(input?.events) ? input.events : []
  };

  normalized.people = normalized.people.map((p) => {
    const oldNotes = [p.title ? `Cím / szerep: ${p.title}` : "", p.house ? `Ház / frakció: ${p.house}` : ""].filter(Boolean);
    const notes = [p.notes || "", ...oldNotes.filter((line) => !(p.notes || "").includes(line))].filter(Boolean).join("\n");

    return {
      id: String(p.id || crypto.randomUUID()),
      name: p.name || "Névtelen",
      maidenName: p.maidenName || p.nee || "",
      gender: ["male", "female", "other"].includes(p.gender) ? p.gender : inferGender(p),
      birth: normalizePartialDate(p.birth, p.born, p.birthPlace),
      death: normalizePartialDate(p.death, p.died, ""),
      image: p.image || "",
      color: p.color || randomPaletteColor(),
      notes,
      position: normalizePosition(p.position || p.pos || { x: p.x, y: p.y }),
      parents: Array.isArray(p.parents) ? uniqueIds(p.parents) : [],
      partners: Array.isArray(p.partners) ? uniqueIds(p.partners) : []
    };
  });

  const ids = new Set(normalized.people.map((p) => p.id));

  normalized.people.forEach((p) => {
    p.parents = p.parents.filter((id) => ids.has(id) && id !== p.id);
    p.partners = p.partners.filter((id) => ids.has(id) && id !== p.id);
  });

  const existingKeys = new Set();
  normalized.relationships = normalized.relationships
    .map((r) => normalizeRelationship(r))
    .filter((r) => r && ids.has(r.personA) && ids.has(r.personB) && r.personA !== r.personB)
    .filter((r) => {
      const key = relationshipKey(r.personA, r.personB);
      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    });

  // Backward compatibility: convert old `partners` arrays to relationship records.
  for (const person of normalized.people) {
    for (const partnerId of person.partners || []) {
      if (!ids.has(partnerId) || partnerId === person.id) continue;
      const key = relationshipKey(person.id, partnerId);
      if (!existingKeys.has(key)) {
        normalized.relationships.push({
          id: `rel-${key}`,
          type: "partnership",
          personA: person.id,
          personB: partnerId,
          status: "married",
          notes: "",
          linkStyle: defaultRelationshipStyle("married")
        });
        existingKeys.add(key);
      }
    }
    delete person.partners;
  }

  normalized.linkStyles.parent = Object.fromEntries(
    Object.entries(normalized.linkStyles.parent || {}).filter(([key]) => {
      const [parentId, childId] = key.split("-->");
      return ids.has(parentId) && ids.has(childId);
    })
  );

  normalized.annotations = normalized.annotations.map((ann, index) => ({
    id: String(ann.id || crypto.randomUUID()),
    text: ann.text || ann.note || "Megjegyzés",
    x: numberOrBlank(ann.x) || 80 + index * 28,
    y: numberOrBlank(ann.y) || 80 + index * 28,
    width: Math.max(160, numberOrBlank(ann.width) || 260),
    color: validColor(ann.color) || "#8f8f99"
  }));

  normalized.events = normalized.events.map((event) => normalizeEvent(event, ids));

  return normalized;
}

function inferGender(person) {
  const name = `${person?.name || ""} ${person?.title || ""}`.toLowerCase();
  if (name.includes("úr") || name.includes("kapitány") || name.includes("férfi")) return "male";
  if (name.includes("nő") || name.includes("papnő") || name.includes("úrnő")) return "female";
  return "other";
}

function normalizePartialDate(value, legacyString = "", legacyPlace = "") {
  const result = { year: "", month: "", day: "", place: legacyPlace || "" };
  if (value && typeof value === "object") {
    result.year = numberOrBlank(value.year);
    result.month = numberOrBlank(value.month);
    result.day = numberOrBlank(value.day);
    result.place = value.place || value.birthPlace || legacyPlace || "";
    return result;
  }
  const parsed = parseLegacyDate(legacyString);
  return { ...result, ...parsed };
}

function parseLegacyDate(value) {
  if (!value) return { year: "", month: "", day: "" };
  const parts = String(value).trim().match(/\d+/g) || [];
  return {
    year: numberOrBlank(parts[0]),
    month: numberOrBlank(parts[1]),
    day: numberOrBlank(parts[2])
  };
}

function normalizeRelationship(r) {
  const a = String(r?.personA || r?.a || r?.from || "");
  const b = String(r?.personB || r?.b || r?.to || "");
  if (!a || !b) return null;
  const status = ["married", "partner", "divorced", "widowed"].includes(r.status) ? r.status : "married";
  return {
    id: String(r.id || `rel-${relationshipKey(a, b)}`),
    type: "partnership",
    personA: a,
    personB: b,
    status,
    notes: r.notes || "",
    linkStyle: normalizeLinkStyle(r.linkStyle || r.style || defaultRelationshipStyle(status), defaultRelationshipStyle(status))
  };
}

function normalizeLinkStyles(value) {
  const parent = {};
  const source = value?.parent || value?.parents || {};
  for (const [key, style] of Object.entries(source)) {
    const clean = normalizeLinkStyle(style, defaultParentStyle());
    if (clean) parent[String(key)] = clean;
  }
  return { parent };
}

function normalizeLinkStyle(style, fallback = defaultParentStyle()) {
  const rawWidth = Number(style?.width);
  const width = Math.max(1, Math.min(12, Number.isFinite(rawWidth) && rawWidth > 0 ? rawWidth : fallback.width || 2.5));
  return {
    color: validColor(style?.color) || fallback.color || "#c4c4d0",
    width,
    pattern: ["solid", "dashed", "dotted", "longdash"].includes(style?.pattern) ? style.pattern : fallback.pattern || "solid"
  };
}

function normalizePosition(value) {
  const x = numberOrBlank(value?.x);
  const y = numberOrBlank(value?.y);
  if (x === "" || y === "") return null;
  return { x: Math.max(0, x), y: Math.max(0, y) };
}

function defaultParentStyle() {
  return { color: "#c4c4d0", width: 2.4, pattern: "solid" };
}

function defaultRelationshipStyle(status = "married") {
  const defaults = {
    married: { color: "#e6e6ee", width: 3.2, pattern: "solid" },
    partner: { color: "#d6d6df", width: 2.8, pattern: "dashed" },
    divorced: { color: "#e06b6b", width: 3, pattern: "dotted" },
    widowed: { color: "#aaaab4", width: 2.8, pattern: "dashed" }
  };
  return defaults[status] || defaults.partner;
}

function parentLinkKey(parentId, childId) {
  return `${parentId}-->${childId}`;
}

function styleDashArray(pattern, width = 2.5) {
  const w = Math.max(1, Number(width) || 2.5);
  if (pattern === "dotted") return `${w * 0.8} ${w * 3}`;
  if (pattern === "dashed") return `${w * 4} ${w * 2.6}`;
  if (pattern === "longdash") return `${w * 8} ${w * 3}`;
  return "";
}

function applySvgLineStyle(path, style) {
  path.setAttribute("stroke", style.color);
  path.setAttribute("stroke-width", style.width);
  path.setAttribute("stroke-linecap", "round");
  const dash = styleDashArray(style.pattern, style.width);
  if (dash) path.setAttribute("stroke-dasharray", dash);
  else path.removeAttribute("stroke-dasharray");
}

function normalizeEvent(event, ids) {
  return {
    id: String(event.id || crypto.randomUUID()),
    year: numberOrBlank(event.year),
    month: numberOrBlank(event.month),
    day: numberOrBlank(event.day),
    title: event.title || "Új esemény",
    description: event.description || event.notes || "",
    personIds: Array.isArray(event.personIds) ? uniqueIds(event.personIds).filter((id) => ids.has(id)) : [],
    color: validColor(event.color) || "#a9a9b4"
  };
}

function bindUi() {
  $("#showTree").addEventListener("click", () => setView("tree"));
  $("#showTimeline").addEventListener("click", () => setView("timeline"));

  $("#metaTitle").addEventListener("input", (e) => updateMeta("title", e.target.value));
  $("#metaSubtitle").addEventListener("input", (e) => updateMeta("subtitle", e.target.value));
  $("#metaCurrentYear").addEventListener("input", (e) => updateMeta("currentYear", numberOrBlank(e.target.value) || 2032));

  $("#addPerson").addEventListener("click", addPerson);
  $("#deletePerson").addEventListener("click", deleteSelectedPerson);
  $("#search").addEventListener("input", renderPersonList);

  $("#exportJson").addEventListener("click", exportJson);
  $("#importJson").addEventListener("change", importJson);
  $("#resetSample").addEventListener("click", resetSample);
  $("#clearLocal").addEventListener("click", clearLocal);
  $("#zoomIn").addEventListener("click", () => setZoom(zoom + 0.1));
  $("#zoomOut").addEventListener("click", () => setZoom(zoom - 0.1));
  $("#zoomReset").addEventListener("click", () => setZoom(1));
  $("#autoLayout").addEventListener("click", resetPersonPositions);
  $("#exportPng").addEventListener("click", exportPng);

  $("#firebaseConnect").addEventListener("click", connectFirebase);
  $("#firebaseLoad").addEventListener("click", loadFromFirebase);
  $("#firebaseSave").addEventListener("click", saveToFirebase);
  $("#firebaseLive").addEventListener("click", toggleFirebaseLiveSync);
  $("#firebaseGoogleSignIn").addEventListener("click", signInGoogleFirebase);
  $("#firebaseSignIn").addEventListener("click", signInFirebase);
  $("#firebaseSignOut").addEventListener("click", signOutFirebase);

  form.addEventListener("input", (e) => {
    if (e.target.name === "imageFile") return;
    const person = getSelected();
    if (!person) return;
    updatePersonFromForm(person, e.target.name, e.target.value);
    persistAndRender(false);
  });
  if (form.elements.imageFile) {
    form.elements.imageFile.addEventListener("change", uploadPersonImage);
  }

  $("#linkStyleSelect").addEventListener("change", (e) => {
    selectedLinkKey = e.target.value || null;
    renderLinkStyleEditor(getSelected());
  });
  linkStyleForm.addEventListener("input", updateSelectedLinkStyle);

  $("#addParent").addEventListener("click", () => addRelationship("parent"));
  $("#addPartner").addEventListener("click", () => addRelationship("partner"));
  $("#addChild").addEventListener("click", () => addRelationship("child"));

  $("#addAnnotation").addEventListener("click", addAnnotation);
  $("#deleteAnnotation").addEventListener("click", deleteSelectedAnnotation);
  $("#annotationSelect").addEventListener("change", (e) => {
    selectedAnnotationId = e.target.value || null;
    render();
  });
  annotationForm.addEventListener("input", (e) => {
    const annotation = getSelectedAnnotation();
    if (!annotation) return;
    updateAnnotationFromForm(annotation, e.target.name, e.target.value);
    persistAndRender(false);
  });

  $("#addEvent").addEventListener("click", addEvent);
  $("#deleteEvent").addEventListener("click", deleteSelectedEvent);
  $("#eventSelect").addEventListener("change", (e) => {
    selectedEventId = e.target.value || null;
    render();
  });
  eventForm.addEventListener("input", (e) => {
    const event = getSelectedEvent();
    if (!event) return;
    updateEventFromForm(event, e.target.name, e.target.value);
    persistAndRender(false);
  });
  $("#eventPeople").addEventListener("change", (e) => {
    const event = getSelectedEvent();
    if (!event) return;
    event.personIds = Array.from(e.target.selectedOptions).map((option) => option.value);
    persistAndRender(false);
  });

  bindStagePanning();
}

function bindStagePanning() {
  if (!stageScroll) return;

  stageScroll.addEventListener("pointerdown", (event) => {
    if (activeView !== "tree" || event.button !== 0) return;
    if (event.target.closest(".person-card, .tree-note, button, input, textarea, select, label, a")) return;

    event.preventDefault();
    stageScroll.setPointerCapture(event.pointerId);
    stageScroll.classList.add("panning");

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = stageScroll.scrollLeft;
    const startTop = stageScroll.scrollTop;

    const onMove = (moveEvent) => {
      stageScroll.scrollLeft = startLeft - (moveEvent.clientX - startX);
      stageScroll.scrollTop = startTop - (moveEvent.clientY - startY);
    };

    const onUp = () => {
      stageScroll.classList.remove("panning");
      stageScroll.removeEventListener("pointermove", onMove);
      stageScroll.removeEventListener("pointerup", onUp);
      stageScroll.removeEventListener("pointercancel", onUp);
    };

    stageScroll.addEventListener("pointermove", onMove);
    stageScroll.addEventListener("pointerup", onUp);
    stageScroll.addEventListener("pointercancel", onUp);
  });
}


function setView(view) {
  activeView = view;
  $("#treeView").classList.toggle("active", view === "tree");
  $("#timelineView").classList.toggle("active", view === "timeline");
  $("#showTree").classList.toggle("active", view === "tree");
  $("#showTimeline").classList.toggle("active", view === "timeline");
  $("#zoomOut").disabled = view !== "tree";
  $("#zoomReset").disabled = view !== "tree";
  $("#zoomIn").disabled = view !== "tree";
  $("#autoLayout").disabled = view !== "tree";
  $("#exportPng").disabled = view !== "tree";
}

function updateMeta(key, value) {
  data.meta[key] = value;
  persistAndRender(false);
}

function updatePersonFromForm(person, name, value) {
  const dateFields = {
    birthYear: ["birth", "year"],
    birthMonth: ["birth", "month"],
    birthDay: ["birth", "day"],
    birthPlace: ["birth", "place"],
    deathYear: ["death", "year"],
    deathMonth: ["death", "month"],
    deathDay: ["death", "day"]
  };
  if (dateFields[name]) {
    const [group, key] = dateFields[name];
    person[group][key] = key === "place" ? value : numberOrBlank(value);
    return;
  }
  person[name] = value;
}

function uploadPersonImage(event) {
  const person = getSelected();
  const file = event.target.files?.[0];
  if (!person || !file) return;
  if (!file.type.startsWith("image/")) {
    alert("Képfájlt válassz ki.");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    person.image = String(reader.result || "");
    form.elements.image.value = person.image;
    event.target.value = "";
    persistAndRender(false);
  };
  reader.onerror = () => alert("Nem sikerült beolvasni a képet.");
  reader.readAsDataURL(file);
}

function updateAnnotationFromForm(annotation, name, value) {
  if (["x", "y", "width"].includes(name)) annotation[name] = Math.max(name === "width" ? 160 : 0, numberOrBlank(value) || 0);
  else annotation[name] = value;
}

function updateEventFromForm(event, name, value) {
  if (["year", "month", "day"].includes(name)) event[name] = numberOrBlank(value);
  else if (name !== "personIds") event[name] = value;
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanForSave(data), null, 2));
}

function persistAndRender(full = true) {
  saveLocal();
  render(full);
}

function render() {
  $("#treeTitle").textContent = data.meta.title;
  $("#treeSubtitle").textContent = data.meta.subtitle;
  $("#metaTitle").value = data.meta.title;
  $("#metaSubtitle").value = data.meta.subtitle;
  $("#metaCurrentYear").value = data.meta.currentYear || 2032;
  renderTree();
  renderTimeline();
  renderPersonList();
  renderEditor();
  renderAnnotationEditor();
  renderEventEditor();
  setView(activeView);
}

function renderTree() {
  const layout = calculateLayout(data.people, data.annotations);
  positions = layout.positions;

  stage.style.width = `${layout.width}px`;
  stage.style.height = `${layout.height}px`;
  applyStageScale();
  links.setAttribute("width", layout.width);
  links.setAttribute("height", layout.height);
  links.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);

  links.innerHTML = "";
  cards.innerHTML = "";
  annotationsLayer.innerHTML = "";

  drawParentLinks();
  drawPartnerLinks();
  renderPersonCards();
  renderAnnotations();
  renderEmptyTreeHint();
}

function renderPersonCards() {
  for (const person of data.people) {
    const pos = positions.get(person.id) || { x: 20, y: 20 };
    const card = document.createElement("article");
    card.className = `person-card gender-${person.gender || "other"} ${person.id === selectedId ? "selected" : ""}`;
    card.style.left = `${pos.x}px`;
    card.style.top = `${pos.y}px`;
    card.style.setProperty("--card-color", person.color || "#a9a9b4");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${person.name} kiválasztása`);
    card.addEventListener("click", (e) => {
      if (suppressCardClickId === person.id) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      selectPerson(person.id);
    });
    card.addEventListener("pointerdown", (e) => startPersonDrag(e, person, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") selectPerson(person.id);
    });

    const avatar = person.image
      ? `<img class="avatar" src="${escapeAttr(person.image)}" alt="${escapeAttr(person.name)}" onerror="this.replaceWith(initialAvatar('${escapeAttr(initials(person.name))}'))">`
      : `<div class="avatar">${escapeHtml(initials(person.name))}</div>`;

    const maiden = person.maidenName ? `<div class="maiden">${escapeHtml(person.maidenName)}</div>` : "";
    const dates = formatLife(person);
    const place = person.birth.place ? `<div class="place">✦ ${escapeHtml(person.birth.place)}</div>` : "";
    const notes = person.notes ? `<div class="notes">${escapeHtml(person.notes)}</div>` : "";

    card.innerHTML = `
      <div class="portrait-frame">
        ${avatar}
        <div class="gender-icon gender-badge" title="${genderLabel(person.gender)}">${genderIcon(person.gender)}</div>
      </div>
      <div class="person-body">
        <div class="name-line">
          <div class="name">${escapeHtml(person.name)}</div>
        </div>
        ${maiden}
        <div class="person-facts">
          ${dates ? `<div class="dates">${dates}</div>` : ""}
          ${place}
        </div>
        ${notes}
      </div>
    `;
    cards.appendChild(card);
  }
}

function renderEmptyTreeHint() {
  if (data.people.length) return;
  const hint = document.createElement("div");
  hint.className = "empty-tree-hint";
  hint.innerHTML = `
    <strong>Még üres a családfa.</strong>
    <span>Kezdéshez nyomd meg az „+ Új szereplő” gombot, vagy tölts be JSON-t / felhőadatot.</span>
  `;
  cards.appendChild(hint);
}

function startPersonDrag(event, person, element) {
  if (event.button !== 0) return;
  if (event.target.closest("button, input, textarea, select, label")) return;

  selectedId = person.id;
  const current = positions.get(person.id) || person.position || { x: 20, y: 20 };
  person.position = { x: Math.round(current.x), y: Math.round(current.y) };

  element.setPointerCapture(event.pointerId);
  element.classList.add("dragging");
  const startX = event.clientX;
  const startY = event.clientY;
  const originalX = person.position.x;
  const originalY = person.position.y;
  let moved = false;

  const onMove = (moveEvent) => {
    const dx = (moveEvent.clientX - startX) / zoom;
    const dy = (moveEvent.clientY - startY) / zoom;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    person.position.x = Math.max(0, Math.round(originalX + dx));
    person.position.y = Math.max(0, Math.round(originalY + dy));
    element.style.left = `${person.position.x}px`;
    element.style.top = `${person.position.y}px`;
    ensureStageBounds(person.position.x + CARD_W + 140, person.position.y + CARD_H + 140);
    positions.set(person.id, { x: person.position.x, y: person.position.y });
    redrawLinksOnly();
  };

  const onUp = () => {
    element.classList.remove("dragging");
    element.removeEventListener("pointermove", onMove);
    element.removeEventListener("pointerup", onUp);
    element.removeEventListener("pointercancel", onUp);
    if (moved) {
      suppressCardClickId = person.id;
      setTimeout(() => { suppressCardClickId = null; }, 150);
    }
    saveLocal();
    renderPersonList();
    renderEditor();
  };

  element.addEventListener("pointermove", onMove);
  element.addEventListener("pointerup", onUp);
  element.addEventListener("pointercancel", onUp);
}

function ensureStageBounds(width, height) {
  const currentWidth = Number.parseFloat(stage.style.width) || stage.offsetWidth;
  const currentHeight = Number.parseFloat(stage.style.height) || stage.offsetHeight;
  const nextWidth = Math.max(currentWidth, width);
  const nextHeight = Math.max(currentHeight, height);
  if (nextWidth !== currentWidth || nextHeight !== currentHeight) {
    stage.style.width = `${nextWidth}px`;
    stage.style.height = `${nextHeight}px`;
    links.setAttribute("width", nextWidth);
    links.setAttribute("height", nextHeight);
    links.setAttribute("viewBox", `0 0 ${nextWidth} ${nextHeight}`);
    applyStageScale();
  }
}

function redrawLinksOnly() {
  links.innerHTML = "";
  drawParentLinks();
  drawPartnerLinks();
}

function renderAnnotations() {
  for (const annotation of data.annotations) {
    const note = document.createElement("div");
    note.className = `tree-note ${annotation.id === selectedAnnotationId ? "selected" : ""}`;
    note.style.left = `${annotation.x}px`;
    note.style.top = `${annotation.y}px`;
    note.style.width = `${annotation.width}px`;
    note.style.setProperty("--note-color", annotation.color || "#8f8f99");
    note.textContent = annotation.text || "Megjegyzés";
    note.tabIndex = 0;
    note.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedAnnotationId = annotation.id;
      render();
    });
    note.addEventListener("pointerdown", (e) => startAnnotationDrag(e, annotation, note));
    annotationsLayer.appendChild(note);
  }
}

function startAnnotationDrag(event, annotation, element) {
  if (event.button !== 0) return;
  selectedAnnotationId = annotation.id;
  element.setPointerCapture(event.pointerId);
  element.classList.add("dragging");
  const startX = event.clientX;
  const startY = event.clientY;
  const originalX = annotation.x;
  const originalY = annotation.y;

  const onMove = (moveEvent) => {
    const dx = (moveEvent.clientX - startX) / zoom;
    const dy = (moveEvent.clientY - startY) / zoom;
    annotation.x = Math.max(0, Math.round(originalX + dx));
    annotation.y = Math.max(0, Math.round(originalY + dy));
    element.style.left = `${annotation.x}px`;
    element.style.top = `${annotation.y}px`;
    fillAnnotationForm(annotation);
  };

  const onUp = () => {
    element.classList.remove("dragging");
    element.removeEventListener("pointermove", onMove);
    element.removeEventListener("pointerup", onUp);
    element.removeEventListener("pointercancel", onUp);
    saveLocal();
    renderAnnotationEditor();
  };

  element.addEventListener("pointermove", onMove);
  element.addEventListener("pointerup", onUp);
  element.addEventListener("pointercancel", onUp);
}

function calculateLayout(people, annotations = []) {
  const levelMap = new Map();
  const byId = new Map(people.map((p) => [p.id, p]));

  const getLevel = (person, visiting = new Set()) => {
    if (!person) return 0;
    if (levelMap.has(person.id)) return levelMap.get(person.id);
    if (visiting.has(person.id)) return 0;
    visiting.add(person.id);
    const parentLevels = (person.parents || [])
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((parent) => getLevel(parent, new Set(visiting)) + 1);
    const level = parentLevels.length ? Math.max(...parentLevels) : 0;
    levelMap.set(person.id, level);
    return level;
  };

  people.forEach((p) => getLevel(p));

  const levels = new Map();
  for (const person of people) {
    const level = levelMap.get(person.id) || 0;
    if (!levels.has(level)) levels.set(level, []);
    levels.get(level).push(person);
  }

  for (const persons of levels.values()) {
    persons.sort((a, b) => sortKey(a).localeCompare(sortKey(b), "hu"));
  }

  const positions = new Map();
  const maxLevelSize = Math.max(1, ...Array.from(levels.values()).map((arr) => arr.length));
  let width = Math.max(1250, maxLevelSize * (CARD_W + GAP_X) + GAP_X);
  let height = Math.max(780, (Math.max(0, ...levels.keys()) + 1) * (CARD_H + GAP_Y) + GAP_Y);

  Array.from(levels.entries()).forEach(([level, persons]) => {
    const rowWidth = persons.length * CARD_W + Math.max(0, persons.length - 1) * GAP_X;
    const startX = Math.max(GAP_X / 2, (width - rowWidth) / 2);
    persons.forEach((person, index) => {
      const autoPosition = {
        x: startX + index * (CARD_W + GAP_X),
        y: GAP_Y / 2 + level * (CARD_H + GAP_Y)
      };
      positions.set(person.id, person.position || autoPosition);
    });
  });

  for (const pos of positions.values()) {
    width = Math.max(width, (numberOrBlank(pos.x) || 0) + CARD_W + 120);
    height = Math.max(height, (numberOrBlank(pos.y) || 0) + CARD_H + 120);
  }

  for (const ann of annotations) {
    width = Math.max(width, (numberOrBlank(ann.x) || 0) + (numberOrBlank(ann.width) || 260) + 120);
    height = Math.max(height, (numberOrBlank(ann.y) || 0) + 180);
  }

  return { positions, width, height };
}

function drawParentLinks() {
  for (const child of data.people) {
    const childPos = positions.get(child.id);
    if (!childPos) continue;
    const parents = (child.parents || [])
      .map((id) => ({ person: getPerson(id), pos: positions.get(id) }))
      .filter((x) => x.person && x.pos);

    for (const parent of parents) {
      const x1 = parent.pos.x + CARD_W / 2;
      const y1 = parent.pos.y + CARD_H;
      const x2 = childPos.x + CARD_W / 2;
      const y2 = childPos.y;
      const midY = y1 + (y2 - y1) / 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const style = getParentLinkStyle(parent.person.id, child.id);
      path.setAttribute("class", "link parent-link");
      path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`);
      applySvgLineStyle(path, style);
      links.appendChild(path);
    }
  }
}

function drawPartnerLinks() {
  for (const rel of data.relationships) {
    const a = positions.get(rel.personA);
    const b = positions.get(rel.personB);
    if (!a || !b) continue;
    const x1 = a.x + CARD_W / 2;
    const y1 = a.y + CARD_H / 2;
    const x2 = b.x + CARD_W / 2;
    const y2 = b.y + CARD_H / 2;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const style = normalizeLinkStyle(rel.linkStyle, defaultRelationshipStyle(rel.status));
    path.setAttribute("class", `link partner-link status-${rel.status}`);
    path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    applySvgLineStyle(path, style);
    links.appendChild(path);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", `relationship-label status-${rel.status}`);
    label.setAttribute("x", (x1 + x2) / 2);
    label.setAttribute("y", (y1 + y2) / 2 - 10);
    label.setAttribute("text-anchor", "middle");
    label.textContent = relationshipLabel(rel.status);
    links.appendChild(label);
  }
}

function getParentLinkStyle(parentId, childId) {
  const key = parentLinkKey(parentId, childId);
  return normalizeLinkStyle(data.linkStyles?.parent?.[key], defaultParentStyle());
}

function renderTimeline() {
  const container = $("#timeline");
  const items = deriveTimelineItems();
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="empty-timeline">Még nincs timeline-adat. Adj meg születési/halálozási éveket vagy hozz létre kézi eseményt.</div>`;
    return;
  }

  const groups = new Map();
  for (const item of items) {
    const yearKey = item.year === "" ? "Év nélkül" : String(item.year);
    if (!groups.has(yearKey)) groups.set(yearKey, []);
    groups.get(yearKey).push(item);
  }

  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === "Év nélkül") return 1;
    if (b === "Év nélkül") return -1;
    return Number(a) - Number(b);
  });

  for (const [year, yearItems] of sortedGroups) {
    const section = document.createElement("section");
    section.className = "timeline-year";
    const list = yearItems.sort(compareTimelineItems).map((item) => timelineCardHtml(item)).join("");
    section.innerHTML = `
      <div class="year-label">${escapeHtml(year)}</div>
      <div class="timeline-items">${list}</div>
    `;
    container.appendChild(section);
  }
}

function deriveTimelineItems() {
  const items = [];
  for (const person of data.people) {
    if (numberOrBlank(person.birth?.year)) {
      items.push({
        kind: "birth",
        year: numberOrBlank(person.birth.year),
        month: numberOrBlank(person.birth.month),
        day: numberOrBlank(person.birth.day),
        title: `Születik: ${displayName(person)}`,
        description: person.birth.place ? `Születési hely: ${person.birth.place}` : "",
        people: [person],
        color: person.color || "#a9a9b4"
      });
    }
    if (numberOrBlank(person.death?.year)) {
      items.push({
        kind: "death",
        year: numberOrBlank(person.death.year),
        month: numberOrBlank(person.death.month),
        day: numberOrBlank(person.death.day),
        title: `Meghal: ${displayName(person)}`,
        description: ageText(person),
        people: [person],
        color: person.color || "#a9a9b4"
      });
    }
  }

  for (const event of data.events) {
    const people = (event.personIds || []).map(getPerson).filter(Boolean);
    items.push({
      kind: "event",
      year: numberOrBlank(event.year),
      month: numberOrBlank(event.month),
      day: numberOrBlank(event.day),
      title: event.title || "Esemény",
      description: event.description || "",
      people,
      color: event.color || "#a9a9b4"
    });
  }
  return items;
}

function compareTimelineItems(a, b) {
  return (numberOrBlank(a.month) || 0) - (numberOrBlank(b.month) || 0)
    || (numberOrBlank(a.day) || 0) - (numberOrBlank(b.day) || 0)
    || kindOrder(a.kind) - kindOrder(b.kind)
    || a.title.localeCompare(b.title, "hu");
}

function kindOrder(kind) {
  return { birth: 1, event: 2, death: 3 }[kind] || 9;
}

function timelineCardHtml(item) {
  const date = formatEventDate(item);
  const people = item.people.length ? `<div class="timeline-people">Kapcsolódik: ${escapeHtml(item.people.map(displayName).join(", "))}</div>` : "";
  const description = item.description ? `<div class="timeline-desc">${escapeHtml(item.description)}</div>` : "";
  return `
    <article class="timeline-card ${escapeAttr(item.kind)}" style="--event-color: ${escapeAttr(item.color)}">
      <div class="timeline-date">${escapeHtml(date)}</div>
      <div class="timeline-title">${escapeHtml(item.title)}</div>
      ${description}
      ${people}
    </article>
  `;
}

function formatEventDate(item) {
  const partial = formatPartialDate({ year: item.year, month: item.month, day: item.day });
  if (partial) return partial;
  return "dátum nélkül";
}

function renderPersonList() {
  const list = $("#personList");
  const q = $("#search").value.trim().toLowerCase();
  list.innerHTML = "";

  data.people
    .filter((person) => !q || searchableText(person).includes(q))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b), "hu"))
    .forEach((person) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = person.id === selectedId ? "active" : "";
      btn.innerHTML = `${genderIcon(person.gender)} ${escapeHtml(displayName(person))}`;
      btn.addEventListener("click", () => selectPerson(person.id));
      list.appendChild(btn);
    });
}

function renderEditor() {
  const person = getSelected();
  $("#emptyState").classList.toggle("hidden", Boolean(person));
  form.classList.toggle("hidden", !person);
  $("#relationshipEditor").classList.toggle("hidden", !person);
  $("#deletePerson").disabled = !person;

  if (!person) return;

  form.elements.name.value = person.name || "";
  form.elements.maidenName.value = person.maidenName || "";
  form.elements.gender.value = person.gender || "other";
  form.elements.birthYear.value = person.birth.year || "";
  form.elements.birthMonth.value = person.birth.month || "";
  form.elements.birthDay.value = person.birth.day || "";
  form.elements.birthPlace.value = person.birth.place || "";
  form.elements.deathYear.value = person.death.year || "";
  form.elements.deathMonth.value = person.death.month || "";
  form.elements.deathDay.value = person.death.day || "";
  form.elements.image.value = person.image || "";
  form.elements.color.value = person.color || "#a9a9b4";
  form.elements.notes.value = person.notes || "";

  populateRelationshipSelects(person);
  renderRelationshipChips(person);
  renderLinkStyleEditor(person);
}

function populateRelationshipSelects(person) {
  const candidates = data.people.filter((p) => p.id !== person.id).sort((a, b) => sortKey(a).localeCompare(sortKey(b), "hu"));
  for (const id of ["parentSelect", "partnerSelect", "childSelect"]) {
    const select = $(`#${id}`);
    select.innerHTML = "";
    candidates.forEach((candidate) => {
      const option = document.createElement("option");
      option.value = candidate.id;
      option.textContent = displayName(candidate);
      select.appendChild(option);
    });
  }
}

function renderRelationshipChips(person) {
  renderChips("#parentChips", person.parents || [], (id) => removeParent(person.id, id));

  const partnerRels = data.relationships.filter((rel) => rel.personA === person.id || rel.personB === person.id);
  const partnerContainer = $("#partnerChips");
  partnerContainer.innerHTML = "";
  partnerRels.forEach((rel) => {
    const other = getPerson(rel.personA === person.id ? rel.personB : rel.personA);
    if (!other) return;
    const chip = createChip(`${displayName(other)} · ${relationshipLabel(rel.status)}`, () => removePartnerRelationship(rel.id));
    chip.classList.add(`status-${rel.status}`);
    const select = document.createElement("select");
    select.className = "chip-select";
    ["married", "partner", "divorced", "widowed"].forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = relationshipLabel(status);
      select.appendChild(option);
    });
    select.value = rel.status;
    select.addEventListener("change", (e) => {
      rel.status = e.target.value;
      persistAndRender(false);
    });
    chip.insertBefore(select, chip.querySelector("button"));
    partnerContainer.appendChild(chip);
  });

  const children = data.people.filter((p) => (p.parents || []).includes(person.id)).map((p) => p.id);
  renderChips("#childChips", children, (id) => removeParent(id, person.id));
}

function renderLinkStyleEditor(person) {
  const select = $("#linkStyleSelect");
  const box = $("#linkStyleEditor");
  if (!select || !box) return;

  select.innerHTML = "";
  const options = getEditableLinksForPerson(person);
  box.classList.toggle("hidden", !person || !options.length);
  linkStyleForm.classList.toggle("hidden", !person || !options.length);

  if (!person || !options.length) {
    selectedLinkKey = null;
    return;
  }

  for (const optionInfo of options) {
    const option = document.createElement("option");
    option.value = optionInfo.key;
    option.textContent = optionInfo.label;
    select.appendChild(option);
  }

  if (!options.some((option) => option.key === selectedLinkKey)) selectedLinkKey = options[0].key;
  select.value = selectedLinkKey || "";
  fillLinkStyleForm(getLinkStyleByKey(selectedLinkKey));
}

function getEditableLinksForPerson(person) {
  if (!person) return [];
  const options = [];

  for (const parentId of person.parents || []) {
    const parent = getPerson(parentId);
    if (!parent) continue;
    const key = `parent:${parentLinkKey(parent.id, person.id)}`;
    options.push({ key, label: `Szülő–gyermek: ${displayName(parent)} → ${displayName(person)}` });
  }

  for (const child of data.people.filter((candidate) => (candidate.parents || []).includes(person.id))) {
    const key = `parent:${parentLinkKey(person.id, child.id)}`;
    options.push({ key, label: `Szülő–gyermek: ${displayName(person)} → ${displayName(child)}` });
  }

  for (const rel of data.relationships.filter((relationship) => relationship.personA === person.id || relationship.personB === person.id)) {
    const other = getPerson(rel.personA === person.id ? rel.personB : rel.personA);
    if (!other) continue;
    options.push({ key: `relationship:${rel.id}`, label: `Partnerkapcsolat: ${displayName(person)} ↔ ${displayName(other)} (${relationshipLabel(rel.status)})` });
  }

  return options;
}

function getLinkStyleByKey(key) {
  if (!key) return null;
  const [kind, id] = key.split(":");
  if (kind === "parent") return normalizeLinkStyle(data.linkStyles?.parent?.[id], defaultParentStyle());
  if (kind === "relationship") {
    const rel = data.relationships.find((relationship) => relationship.id === id);
    return rel ? normalizeLinkStyle(rel.linkStyle, defaultRelationshipStyle(rel.status)) : null;
  }
  return null;
}

function fillLinkStyleForm(style) {
  if (!style || !linkStyleForm || linkStyleForm.classList.contains("hidden")) return;
  linkStyleForm.elements.color.value = validColor(style.color) || "#c4c4d0";
  linkStyleForm.elements.width.value = style.width || 2.5;
  linkStyleForm.elements.pattern.value = style.pattern || "solid";
}

function updateSelectedLinkStyle() {
  if (!selectedLinkKey) return;
  const style = normalizeLinkStyle({
    color: linkStyleForm.elements.color.value,
    width: linkStyleForm.elements.width.value,
    pattern: linkStyleForm.elements.pattern.value
  }, defaultParentStyle());

  const [kind, id] = selectedLinkKey.split(":");
  if (kind === "parent") {
    data.linkStyles ||= { parent: {} };
    data.linkStyles.parent ||= {};
    data.linkStyles.parent[id] = style;
  } else if (kind === "relationship") {
    const rel = data.relationships.find((relationship) => relationship.id === id);
    if (rel) rel.linkStyle = style;
  }

  persistAndRender(false);
}

function renderChips(selector, ids, removeFn) {
  const container = $(selector);
  container.innerHTML = "";
  ids.forEach((id) => {
    const person = getPerson(id);
    if (!person) return;
    container.appendChild(createChip(displayName(person), () => removeFn(id)));
  });
}

function createChip(label, onRemove) {
  const template = $("#chipTemplate");
  const chip = template.content.firstElementChild.cloneNode(true);
  chip.querySelector("span").textContent = label;
  chip.querySelector("button").addEventListener("click", onRemove);
  return chip;
}

function renderAnnotationEditor() {
  const select = $("#annotationSelect");
  select.innerHTML = "";
  data.annotations.forEach((annotation, index) => {
    const option = document.createElement("option");
    option.value = annotation.id;
    option.textContent = annotation.text ? annotation.text.slice(0, 52) : `Megjegyzés ${index + 1}`;
    select.appendChild(option);
  });

  const annotation = getSelectedAnnotation() || data.annotations[0] || null;
  if (annotation && selectedAnnotationId !== annotation.id) selectedAnnotationId = annotation.id;
  select.value = selectedAnnotationId || "";
  annotationForm.classList.toggle("hidden", !annotation);
  $("#deleteAnnotation").disabled = !annotation;
  if (annotation) fillAnnotationForm(annotation);
}

function fillAnnotationForm(annotation) {
  if (!annotation || annotationForm.classList.contains("hidden")) return;
  annotationForm.elements.text.value = annotation.text || "";
  annotationForm.elements.x.value = annotation.x || 0;
  annotationForm.elements.y.value = annotation.y || 0;
  annotationForm.elements.width.value = annotation.width || 260;
  annotationForm.elements.color.value = annotation.color || "#8f8f99";
}

function renderEventEditor() {
  const select = $("#eventSelect");
  select.innerHTML = "";
  data.events
    .slice()
    .sort((a, b) => (numberOrBlank(a.year) || 999999) - (numberOrBlank(b.year) || 999999) || a.title.localeCompare(b.title, "hu"))
    .forEach((event) => {
      const option = document.createElement("option");
      option.value = event.id;
      option.textContent = `${event.year || "?"} · ${event.title || "Esemény"}`;
      select.appendChild(option);
    });

  const event = getSelectedEvent() || data.events[0] || null;
  if (event && selectedEventId !== event.id) selectedEventId = event.id;
  select.value = selectedEventId || "";
  eventForm.classList.toggle("hidden", !event);
  $("#deleteEvent").disabled = !event;
  populateEventPeople();
  if (event) fillEventForm(event);
}

function populateEventPeople() {
  const select = $("#eventPeople");
  select.innerHTML = "";
  data.people
    .slice()
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b), "hu"))
    .forEach((person) => {
      const option = document.createElement("option");
      option.value = person.id;
      option.textContent = displayName(person);
      select.appendChild(option);
    });
}

function fillEventForm(event) {
  eventForm.elements.year.value = event.year || "";
  eventForm.elements.month.value = event.month || "";
  eventForm.elements.day.value = event.day || "";
  eventForm.elements.title.value = event.title || "";
  eventForm.elements.description.value = event.description || "";
  eventForm.elements.color.value = event.color || "#a9a9b4";
  const ids = new Set(event.personIds || []);
  Array.from($("#eventPeople").options).forEach((option) => {
    option.selected = ids.has(option.value);
  });
}

function selectPerson(id) {
  selectedId = id;
  render();
}

function addPerson() {
  const id = crypto.randomUUID();
  const person = {
    id,
    name: "Új szereplő",
    maidenName: "",
    gender: "other",
    birth: { year: "", month: "", day: "", place: "" },
    death: { year: "", month: "", day: "" },
    image: "",
    color: randomPaletteColor(),
    notes: "",
    parents: []
  };
  data.people.push(person);
  selectedId = id;
  persistAndRender();
}

function deleteSelectedPerson() {
  const person = getSelected();
  if (!person) return;
  const ok = window.confirm(`Biztosan törlöd?\n\n${person.name}`);
  if (!ok) return;
  data.people = data.people.filter((p) => p.id !== person.id);
  data.people.forEach((p) => {
    p.parents = (p.parents || []).filter((id) => id !== person.id);
  });
  data.relationships = data.relationships.filter((rel) => rel.personA !== person.id && rel.personB !== person.id);
  data.events.forEach((event) => {
    event.personIds = (event.personIds || []).filter((id) => id !== person.id);
  });
  selectedId = data.people[0]?.id || null;
  persistAndRender();
}

function addRelationship(kind) {
  const person = getSelected();
  if (!person) return;

  if (kind === "parent") {
    const parentId = $("#parentSelect").value;
    if (parentId && parentId !== person.id && !person.parents.includes(parentId)) {
      person.parents.push(parentId);
      persistAndRender();
    }
    return;
  }

  if (kind === "child") {
    const childId = $("#childSelect").value;
    const child = getPerson(childId);
    if (child && child.id !== person.id && !child.parents.includes(person.id)) {
      child.parents.push(person.id);
      persistAndRender();
    }
    return;
  }

  if (kind === "partner") {
    const partnerId = $("#partnerSelect").value;
    const status = $("#partnerStatus").value || "married";
    if (!partnerId || partnerId === person.id) return;
    const existing = findRelationship(person.id, partnerId);
    if (existing) {
      existing.status = status;
      existing.linkStyle = normalizeLinkStyle(existing.linkStyle, defaultRelationshipStyle(status));
    }
    else data.relationships.push({
      id: `rel-${relationshipKey(person.id, partnerId)}`,
      type: "partnership",
      personA: person.id,
      personB: partnerId,
      status,
      notes: "",
      linkStyle: defaultRelationshipStyle(status)
    });
    persistAndRender();
  }
}

function removeParent(childId, parentId) {
  const child = getPerson(childId);
  if (!child) return;
  child.parents = (child.parents || []).filter((id) => id !== parentId);
  persistAndRender();
}

function removePartnerRelationship(relId) {
  data.relationships = data.relationships.filter((rel) => rel.id !== relId);
  persistAndRender();
}

function addAnnotation() {
  const scroll = $("#stageScroll");
  const annotation = {
    id: crypto.randomUUID(),
    text: "Új fa-megjegyzés\nIde jöhet az ág titka vagy magyarázata.",
    x: Math.round((scroll.scrollLeft + 130) / zoom),
    y: Math.round((scroll.scrollTop + 130) / zoom),
    width: 280,
    color: "#8f8f99"
  };
  data.annotations.push(annotation);
  selectedAnnotationId = annotation.id;
  setView("tree");
  persistAndRender();
}

function deleteSelectedAnnotation() {
  if (!selectedAnnotationId) return;
  data.annotations = data.annotations.filter((annotation) => annotation.id !== selectedAnnotationId);
  selectedAnnotationId = data.annotations[0]?.id || null;
  persistAndRender();
}

function addEvent() {
  const currentYear = numberOrBlank(data.meta.currentYear) || 2032;
  const event = {
    id: crypto.randomUUID(),
    year: currentYear,
    month: "",
    day: "",
    title: "Új kampányesemény",
    description: "",
    personIds: selectedId ? [selectedId] : [],
    color: "#a9a9b4"
  };
  data.events.push(event);
  selectedEventId = event.id;
  setView("timeline");
  persistAndRender();
}

function deleteSelectedEvent() {
  if (!selectedEventId) return;
  data.events = data.events.filter((event) => event.id !== selectedEventId);
  selectedEventId = data.events[0]?.id || null;
  persistAndRender();
}

function getSelected() {
  return selectedId ? getPerson(selectedId) : null;
}

function getPerson(id) {
  return data.people.find((p) => p.id === id) || null;
}

function getSelectedAnnotation() {
  return selectedAnnotationId ? data.annotations.find((annotation) => annotation.id === selectedAnnotationId) || null : null;
}

function getSelectedEvent() {
  return selectedEventId ? data.events.find((event) => event.id === selectedEventId) || null : null;
}

function findRelationship(a, b) {
  const key = relationshipKey(a, b);
  return data.relationships.find((rel) => relationshipKey(rel.personA, rel.personB) === key) || null;
}

function relationshipKey(a, b) {
  return [String(a), String(b)].sort().join("--");
}

function resetPersonPositions() {
  const ok = window.confirm("Újraszámoljam az automatikus elrendezést? Ez törli a kézzel húzott karakterpozíciókat.");
  if (!ok) return;
  data.people.forEach((person) => { delete person.position; });
  persistAndRender();
}

function setZoom(value) {
  const previousZoom = zoom;
  const rect = stageScroll.getBoundingClientRect();
  const centerX = (stageScroll.scrollLeft + rect.width / 2) / previousZoom;
  const centerY = (stageScroll.scrollTop + rect.height / 2) / previousZoom;

  zoom = Math.max(0.32, Math.min(1.9, Number(value.toFixed(2))));
  applyStageScale();

  stageScroll.scrollLeft = Math.max(0, centerX * zoom - rect.width / 2);
  stageScroll.scrollTop = Math.max(0, centerY * zoom - rect.height / 2);
}

function applyStageScale() {
  const width = Number.parseFloat(stage.style.width) || stage.offsetWidth || 1200;
  const height = Number.parseFloat(stage.style.height) || stage.offsetHeight || 780;
  stage.style.transform = `scale(${zoom})`;
  if (stageSpace) {
    stageSpace.style.width = `${Math.ceil(width * zoom)}px`;
    stageSpace.style.height = `${Math.ceil(height * zoom)}px`;
  }
  $("#zoomReset").textContent = `${Math.round(zoom * 100)}%`;
}

function exportJson() {
  const blob = new Blob([JSON.stringify(cleanForSave(data), null, 2)], { type: "application/json" });
  downloadBlob(blob, "family.json");
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      data = normalize(JSON.parse(reader.result));
      selectedId = data.people[0]?.id || null;
      selectedAnnotationId = data.annotations[0]?.id || null;
      selectedEventId = data.events[0]?.id || null;
      persistAndRender();
    } catch (error) {
      alert(`Nem sikerült betölteni a JSON-t: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

async function resetSample() {
  const ok = window.confirm("Biztosan üres családfára váltasz? A böngészős aktuális mentés felülíródik.");
  if (!ok) return;
  data = normalize(emptyTreeData());
  selectedId = null;
  selectedAnnotationId = null;
  selectedEventId = null;
  selectedLinkKey = null;
  persistAndRender();
}

function clearLocal() {
  localStorage.removeItem(STORAGE_KEY);
  OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  alert("A böngészős mentés törölve. Frissítés után az üres data/family.json töltődik be.");
}

async function exportPng() {
  const originalZoom = zoom;
  setZoom(1);
  await nextFrame();

  const width = stage.offsetWidth;
  const height = stage.offsetHeight;
  const clone = stage.cloneNode(true);
  clone.style.transform = "none";
  clone.style.position = "relative";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  inlineSvgSize(clone, width, height);

  const css = Array.from(document.styleSheets)
    .map((sheet) => {
      try { return Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n"); }
      catch { return ""; }
    })
    .join("\n");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${css}</style>
          ${clone.outerHTML}
        </div>
      </foreignObject>
    </svg>`;

  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "csaladfa.png");
      URL.revokeObjectURL(url);
      setZoom(originalZoom);
    });
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    setZoom(originalZoom);
    alert("A PNG export nem sikerült ebben a böngészőben. Használd a böngésző képernyőkép funkcióját vagy exportáld JSON-ba.");
  };
  img.src = url;
}

function inlineSvgSize(root, width, height) {
  const svg = root.querySelector("svg");
  if (!svg) return;
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
}

async function connectFirebase() {
  if (firebaseState.ready) return firebaseState;
  setFirebaseStatus("Firebase konfiguráció keresése…");

  try {
    const config = await import("./firebase-config.js");
    const firebaseOptions = config.firebaseOptions || config.default || null;
    const firestorePath = config.firestorePath || "trees/main";
    const authEnabled = config.authEnabled === true;
    if (!firebaseOptions || !firebaseOptions.projectId) throw new Error("A firebaseOptions hiányzik vagy nincs projectId.");

    const appModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`);
    const firestoreModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`);
    const authModule = authEnabled
      ? await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`)
      : null;

    const app = appModule.initializeApp(firebaseOptions);
    const db = firestoreModule.getFirestore(app);
    const ref = firestoreModule.doc(db, ...pathSegments(firestorePath));
    const auth = authModule ? authModule.getAuth(app) : null;

    firebaseState = {
      ...firebaseState,
      ready: true,
      modules: { appModule, firestoreModule, authModule },
      config,
      app,
      db,
      ref,
      auth,
      authEnabled,
      user: auth?.currentUser || null
    };

    if (authEnabled) {
      authModule.onAuthStateChanged(auth, (user) => {
        firebaseState.user = user || null;
        renderFirebaseAuthState();
      });
    }

    renderFirebaseAuthState();
    setFirebaseStatus(`Firebase csatlakozva: ${firestorePath}${authEnabled ? " · Auth bekapcsolva" : ""}`);
    return firebaseState;
  } catch (error) {
    setFirebaseStatus(`Firebase nem elérhető: ${error.message}`, true);
    throw error;
  }
}

async function signInGoogleFirebase() {
  try {
    const state = await connectFirebase();
    if (!state.authEnabled || !state.auth) {
      setFirebaseStatus("Firebase Auth nincs bekapcsolva a firebase-config.js fájlban.", true);
      return;
    }
    const { GoogleAuthProvider, signInWithPopup } = state.modules.authModule;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(state.auth, provider);
    setFirebaseStatus(`Google belépés sikeres: ${result.user.email || result.user.uid}`);
  } catch (error) {
    setFirebaseStatus(`Google belépés sikertelen: ${friendlyFirebaseError(error)}`, true);
  }
}

async function signInFirebase() {
  try {
    const state = await connectFirebase();
    if (!state.authEnabled || !state.auth) {
      setFirebaseStatus("Firebase Auth nincs bekapcsolva a firebase-config.js fájlban.", true);
      return;
    }
    const email = $("#firebaseEmail").value.trim();
    const password = $("#firebasePassword").value;
    if (!email || !password) {
      setFirebaseStatus("Add meg az admin e-mailt és jelszót.", true);
      return;
    }
    const { signInWithEmailAndPassword } = state.modules.authModule;
    await signInWithEmailAndPassword(state.auth, email, password);
    $("#firebasePassword").value = "";
    setFirebaseStatus(`Belépve: ${email}`);
  } catch (error) {
    setFirebaseStatus(`Belépés sikertelen: ${friendlyFirebaseError(error)}`, true);
  }
}

async function signOutFirebase() {
  try {
    const state = await connectFirebase();
    if (!state.authEnabled || !state.auth) return;
    const { signOut } = state.modules.authModule;
    await signOut(state.auth);
    setFirebaseStatus("Kijelentkezve.");
  } catch (error) {
    setFirebaseStatus(`Kilépés sikertelen: ${friendlyFirebaseError(error)}`, true);
  }
}

function renderFirebaseAuthState() {
  const box = $("#firebaseAuthBox");
  const state = $("#firebaseAuthState");
  if (!box || !state) return;
  box.classList.toggle("hidden", !firebaseState.authEnabled);
  if (!firebaseState.authEnabled) return;

  if (firebaseState.user) {
    state.textContent = `Belépve: ${firebaseState.user.email || firebaseState.user.uid}`;
    state.classList.remove("muted");
  } else {
    state.textContent = "Nincs belépve. Mentéshez admin belépés kell, ha a Firestore szabályok így vannak beállítva.";
    state.classList.add("muted");
  }
}

async function loadFromFirebase() {
  try {
    const state = await connectFirebase();
    const { getDoc } = state.modules.firestoreModule;
    const snap = await getDoc(state.ref);
    if (!snap.exists()) {
      setFirebaseStatus("A megadott Firestore dokumentum még üres. Először ments felhőbe.", true);
      return;
    }
    const remote = snap.data();
    data = normalize(remote.tree || remote);
    selectedId = data.people[0]?.id || null;
    selectedAnnotationId = data.annotations[0]?.id || null;
    selectedEventId = data.events[0]?.id || null;
    persistAndRender();
    setFirebaseStatus("Felhőből betöltve.");
  } catch (error) {
    setFirebaseStatus(`Felhő betöltés sikertelen: ${friendlyFirebaseError(error)}`, true);
  }
}

async function saveToFirebase() {
  try {
    const state = await connectFirebase();
    if (state.authEnabled && !state.user) {
      setFirebaseStatus("Felhő mentéshez előbb lépj be admin felhasználóval.", true);
      return;
    }
    const { setDoc, serverTimestamp } = state.modules.firestoreModule;
    await setDoc(state.ref, {
      tree: cleanForSave(data),
      updatedAt: serverTimestamp(),
      updatedBy: state.user?.email || state.user?.uid || "anonymous"
    }, { merge: true });
    setFirebaseStatus("Felhőbe mentve.");
  } catch (error) {
    setFirebaseStatus(`Felhő mentés sikertelen: ${friendlyFirebaseError(error)}`, true);
  }
}

async function toggleFirebaseLiveSync() {
  try {
    const state = await connectFirebase();
    if (state.unsubscribe) {
      state.unsubscribe();
      state.unsubscribe = null;
      $("#firebaseLive").textContent = "Élő sync";
      setFirebaseStatus("Élő sync kikapcsolva.");
      return;
    }

    const { onSnapshot } = state.modules.firestoreModule;
    state.unsubscribe = onSnapshot(state.ref, (snap) => {
      if (!snap.exists()) return;
      const remote = snap.data();
      data = normalize(remote.tree || remote);
      if (!getSelected()) selectedId = data.people[0]?.id || null;
      if (!getSelectedAnnotation()) selectedAnnotationId = data.annotations[0]?.id || null;
      if (!getSelectedEvent()) selectedEventId = data.events[0]?.id || null;
      saveLocal();
      render();
      setFirebaseStatus("Élő sync aktív. Frissítve a felhőből.");
    }, (error) => {
      setFirebaseStatus(`Élő sync hiba: ${friendlyFirebaseError(error)}`, true);
    });
    $("#firebaseLive").textContent = "Élő sync kikapcsolása";
    setFirebaseStatus("Élő sync aktív.");
  } catch (error) {
    setFirebaseStatus(`Élő sync sikertelen: ${friendlyFirebaseError(error)}`, true);
  }
}

function setFirebaseStatus(message, isError = false) {
  const el = $("#firebaseStatus");
  el.textContent = message;
  el.classList.toggle("error", isError);
  el.classList.toggle("muted", !isError);
}

function friendlyFirebaseError(error) {
  const code = error?.code || "";
  if (code.includes("permission-denied")) return "nincs jogosultság. Ellenőrizd a Firestore Rules-t és a belépett e-mailt.";
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) return "hibás e-mail vagy jelszó.";
  if (code.includes("auth/user-not-found")) return "nincs ilyen Firebase Auth felhasználó.";
  if (code.includes("auth/too-many-requests")) return "túl sok sikertelen próbálkozás, próbáld később.";
  if (code.includes("auth/popup-closed-by-user")) return "a Google belépési ablak bezáródott.";
  if (code.includes("auth/popup-blocked")) return "a böngésző blokkolta a felugró Google belépési ablakot.";
  if (code.includes("auth/unauthorized-domain")) return "ez a domain nincs engedélyezve Firebase Authentication → Settings → Authorized domains alatt.";
  if (code.includes("auth/operation-not-allowed")) return "a választott belépési mód nincs bekapcsolva a Firebase Console-ban.";
  return error?.message || String(error);
}

function pathSegments(path) {
  const segments = Array.isArray(path) ? path : String(path).split("/");
  const clean = segments.map((s) => String(s).trim()).filter(Boolean);
  if (clean.length % 2 !== 0) throw new Error("A firestorePath dokumentumútvonal legyen, pl. 'trees/main'.");
  return clean;
}

function cleanForSave(source) {
  return {
    meta: {
      title: source.meta.title || "RPG családfa",
      subtitle: source.meta.subtitle || "",
      currentYear: numberOrBlank(source.meta.currentYear) || 2032
    },
    people: source.people.map((p) => ({
      id: p.id,
      name: p.name || "Névtelen",
      maidenName: p.maidenName || "",
      gender: ["male", "female", "other"].includes(p.gender) ? p.gender : "other",
      birth: {
        year: numberOrBlank(p.birth?.year),
        month: numberOrBlank(p.birth?.month),
        day: numberOrBlank(p.birth?.day),
        place: p.birth?.place || ""
      },
      death: {
        year: numberOrBlank(p.death?.year),
        month: numberOrBlank(p.death?.month),
        day: numberOrBlank(p.death?.day)
      },
      image: p.image || "",
      color: validColor(p.color) || "#a9a9b4",
      notes: p.notes || "",
      position: normalizePosition(p.position),
      parents: uniqueIds(p.parents || [])
    })),
    linkStyles: cleanLinkStyles(source),
    relationships: source.relationships.map((r) => ({
      id: r.id || `rel-${relationshipKey(r.personA, r.personB)}`,
      type: "partnership",
      personA: r.personA,
      personB: r.personB,
      status: ["married", "partner", "divorced", "widowed"].includes(r.status) ? r.status : "married",
      notes: r.notes || "",
      linkStyle: normalizeLinkStyle(r.linkStyle, defaultRelationshipStyle(r.status))
    })),
    annotations: source.annotations.map((ann) => ({
      id: ann.id,
      text: ann.text || "",
      x: Math.max(0, numberOrBlank(ann.x) || 0),
      y: Math.max(0, numberOrBlank(ann.y) || 0),
      width: Math.max(160, numberOrBlank(ann.width) || 260),
      color: validColor(ann.color) || "#8f8f99"
    })),
    events: source.events.map((event) => ({
      id: event.id,
      year: numberOrBlank(event.year),
      month: numberOrBlank(event.month),
      day: numberOrBlank(event.day),
      title: event.title || "Esemény",
      description: event.description || "",
      personIds: uniqueIds(event.personIds || []).filter((id) => source.people.some((p) => p.id === id)),
      color: validColor(event.color) || "#a9a9b4"
    }))
  };
}

function cleanLinkStyles(source) {
  const ids = new Set(source.people.map((p) => p.id));
  const parent = {};
  for (const [key, style] of Object.entries(source.linkStyles?.parent || {})) {
    const [parentId, childId] = key.split("-->");
    if (!ids.has(parentId) || !ids.has(childId)) continue;
    const child = source.people.find((p) => p.id === childId);
    if (!child || !(child.parents || []).includes(parentId)) continue;
    parent[key] = normalizeLinkStyle(style, defaultParentStyle());
  }
  return { parent };
}

function formatLife(person) {
  const born = formatPartialDate(person.birth);
  const died = formatPartialDate(person.death);
  const age = ageText(person);
  if (born || died) return `${born || "?"} – ${died || ""}${age ? ` · ${age}` : ""}`;
  return age;
}

function formatPartialDate(date) {
  const y = numberOrBlank(date?.year);
  const m = numberOrBlank(date?.month);
  const d = numberOrBlank(date?.day);
  if (!y && !m && !d) return "";
  const parts = [];
  if (y) parts.push(String(y).padStart(4, "0").replace(/^0+(?=\d{3,}$)/, ""));
  if (m) parts.push(String(m).padStart(2, "0"));
  if (d) parts.push(String(d).padStart(2, "0"));
  return parts.join(".");
}

function ageText(person) {
  const birthYear = numberOrBlank(person.birth?.year);
  if (!birthYear) return "";
  const deathYear = numberOrBlank(person.death?.year);
  const baseYear = deathYear || numberOrBlank(data.meta.currentYear) || 2032;
  let age = baseYear - birthYear;

  const hasBirthMonthDay = numberOrBlank(person.birth?.month) && numberOrBlank(person.birth?.day);
  const hasDeathMonthDay = numberOrBlank(person.death?.month) && numberOrBlank(person.death?.day);
  if (deathYear && hasBirthMonthDay && hasDeathMonthDay) {
    const beforeBirthday = Number(person.death.month) < Number(person.birth.month)
      || (Number(person.death.month) === Number(person.birth.month) && Number(person.death.day) < Number(person.birth.day));
    if (beforeBirthday) age -= 1;
  }

  if (age < 0) return "";
  const approximate = !hasBirthMonthDay || !deathYear || (deathYear && !hasDeathMonthDay);
  const prefix = approximate ? "kb. " : "";
  return deathYear ? `† ${prefix}${age} évesen` : `${prefix}${age} éves`;
}

function displayName(person) {
  return person.maidenName ? `${person.name} (${person.maidenName})` : person.name;
}

function searchableText(person) {
  return [person.name, person.maidenName, person.birth?.place, person.notes, genderLabel(person.gender), formatPartialDate(person.birth), formatPartialDate(person.death)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function sortKey(person) {
  return `${numberOrBlank(person.birth?.year) || 999999}-${person.name}`;
}

function genderIcon(gender) {
  if (gender === "male") return "♂";
  if (gender === "female") return "♀";
  return "⚧";
}

function genderLabel(gender) {
  if (gender === "male") return "férfi";
  if (gender === "female") return "nő";
  return "egyéb";
}

function relationshipLabel(status) {
  return {
    married: "házas",
    partner: "partner",
    divorced: "elvált",
    widowed: "özvegy"
  }[status] || "kapcsolat";
}

function initials(name) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";
}

window.initialAvatar = function initialAvatar(text) {
  const div = document.createElement("div");
  div.className = "avatar";
  div.textContent = text || "?";
  return div;
};

function randomPaletteColor() {
  const colors = ["#b8b8c2", "#767680", "#9a9aa5", "#6f7f92", "#846f92", "#92746f", "#6f9289", "#a18d68"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function validColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value) : "";
}

function numberOrBlank(value) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return Math.trunc(n);
}

function uniqueIds(ids) {
  return [...new Set(ids.map((id) => String(id)).filter(Boolean))];
}

function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
