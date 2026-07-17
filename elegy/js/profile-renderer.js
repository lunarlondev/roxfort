function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function renderParagraphs(container, value) {
  container.innerHTML = "";
  const paragraphs = Array.isArray(value) ? value : value ? [value] : [];
  paragraphs.forEach((paragraph) => container.appendChild(createElement("p", "", paragraph)));
}

function appendKeyValue(container, key, value) {
  if (value === undefined || value === null || value === "") return;
  const card = createElement("div", "profile-kv");
  card.append(createElement("div", "profile-kv__key", key), createElement("div", "profile-kv__value", String(value)));
  container.appendChild(card);
}

function appendListOrText(container, value) {
  if (Array.isArray(value)) {
    const list = createElement("ul", "profile-fact__list");
    value.forEach((item) => list.appendChild(createElement("li", "", item)));
    container.appendChild(list);
    return;
  }
  container.appendChild(createElement("div", "profile-fact__value", value || ""));
}

export class ProfileRenderer {
  constructor(root = document) {
    this.root = root;
  }

  render(data) {
    this.renderHeader(data.header || {});
    this.renderBasics(data.basics || []);
    this.renderStoryIntro(data.story || {});
    this.renderTimeline(data.past?.timeline || []);
    this.renderPersonality(data.personality || {});
    this.renderTrivia(data.trivia || []);
    this.renderFamily(data.family || {});
    this.renderAppearance(data.appearance || {});
    this.renderKnowledge(data.knowledge || {});
    this.renderAdditional(data.additional || []);
    this.renderSources(data.sources || []);
  }

  renderHeader(header) {
    const name = this.root.getElementById("characterName");
    const motto = this.root.getElementById("characterMotto");
    const images = this.root.getElementById("headerImages");
    name.textContent = header.name || "KARAKTER NEVE";
    motto.textContent = header.motto || "";
    images.innerHTML = "";
    (header.images || []).slice(0, 3).forEach((image, index) => {
      const frame = createElement("div", "profile-hero__portrait");
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || `${header.name || "Karakter"} hangulatkép ${index + 1}`;
      img.loading = index === 0 ? "eager" : "lazy";
      img.addEventListener("error", () => img.remove(), { once: true });
      frame.appendChild(img);
      images.appendChild(frame);
    });
    while (images.children.length < 3) images.appendChild(createElement("div", "profile-hero__portrait"));
  }

  renderBasics(items) {
    const container = this.root.getElementById("basicData");
    container.innerHTML = "";
    items.forEach((item) => appendKeyValue(container, item.label, item.value));
  }

  renderStoryIntro(story) {
    const container = this.root.getElementById("storyIntro");
    const parts = [story.description, story.warning ? `Tartalmi figyelmeztetés: ${story.warning}` : ""].filter(Boolean);
    container.textContent = parts.join("\n");
    container.style.whiteSpace = "pre-line";
    if (!parts.length) container.hidden = true;
  }

  renderTimeline(items) {
    const container = this.root.getElementById("characterTimeline");
    container.innerHTML = "";
    items.forEach((item) => {
      const card = createElement("article", "character-timeline__item");
      card.append(createElement("div", "character-timeline__date", item.date), createElement("div", "character-timeline__text", item.text));
      container.appendChild(card);
    });
  }

  renderPersonality(personality) {
    renderParagraphs(this.root.getElementById("personalityText"), personality.description || []);
    const container = this.root.getElementById("personalityPrompts");
    container.innerHTML = "";
    (personality.prompts || []).forEach((prompt) => {
      const card = createElement("article", "profile-prompt");
      card.appendChild(createElement("div", "profile-prompt__title", prompt.title));
      if (prompt.label) card.appendChild(createElement("div", "profile-prompt__label", prompt.label));
      card.appendChild(createElement("div", "profile-prompt__text", prompt.text));
      container.appendChild(card);
    });
  }

  renderTrivia(items) {
    const container = this.root.getElementById("triviaData");
    container.innerHTML = "";
    items.forEach((item) => {
      const card = createElement("article", `profile-fact${item.wide ? " profile-fact--wide" : ""}`);
      card.appendChild(createElement("div", "profile-fact__label", item.label));
      appendListOrText(card, item.value);
      container.appendChild(card);
    });
  }

  renderFamily(family) {
    const members = this.root.getElementById("familyMembers");
    members.innerHTML = "";
    (family.members || []).forEach((member) => {
      const card = createElement("article", "profile-family-card");
      card.appendChild(createElement("div", "profile-family-card__role", member.role));
      card.appendChild(createElement("div", "profile-family-card__name", member.name));
      const meta = [member.age, member.status].filter(Boolean).join(" · ");
      if (meta) card.appendChild(createElement("div", "profile-family-card__meta", meta));
      card.appendChild(createElement("div", "profile-family-card__description", member.description || ""));
      members.appendChild(card);
    });
    renderParagraphs(this.root.getElementById("familyHistory"), family.history || []);
  }

  renderAppearance(appearance) {
    const data = this.root.getElementById("appearanceData");
    data.innerHTML = "";
    (appearance.details || []).forEach((item) => appendKeyValue(data, item.label, item.value));
    renderParagraphs(this.root.getElementById("appearanceText"), appearance.description || []);
  }

  renderKnowledge(knowledge) {
    const blocks = this.root.getElementById("necromancyBlocks");
    blocks.innerHTML = "";
    (knowledge.necromancy || []).forEach((block) => {
      if (block.type === "heading") blocks.appendChild(createElement("h4", "knowledge-heading", block.text));
      if (block.type === "paragraph") blocks.appendChild(createElement("p", "knowledge-paragraph", block.text));
      if (block.type === "quote") blocks.appendChild(createElement("blockquote", "knowledge-quote", block.text));
      if (block.type === "spell") {
  const card = createElement("article", "knowledge-spell");

  const titleRow = createElement("div", "knowledge-spell__title");

  const statusMap = {
    supported: {
      className: "supported",
      label: "Támogatott"
    },
    tolerated: {
      className: "tolerated",
      label: "Tűrt"
    },
    forbidden: {
      className: "forbidden",
      label: "Tiltott"
    }
  };

  const statusData = statusMap[block.status] || statusMap.forbidden;

  const statusIcon = createElement(
    "span",
    `knowledge-spell__status knowledge-spell__status--${statusData.className}`
  );

  statusIcon.setAttribute(
    "aria-label",
    `${statusData.label}: ${block.meta || ""}`
  );
  statusIcon.tabIndex = 0;

bindSpellTooltip(
  this.root,
  statusIcon,
  block.meta || statusData.label
);

  const spellName = createElement(
    "div",
    "knowledge-spell__name",
    block.name
  );

  titleRow.append(statusIcon, spellName);
  card.appendChild(titleRow);

  card.appendChild(
    createElement(
      "div",
      "knowledge-spell__description",
      block.description || ""
    )
  );

function getSpellTooltip(root = document) {
  let tooltip = root.getElementById("spellTooltip");

  if (!tooltip) {
    tooltip = createElement("div", "knowledge-spell-tooltip");
    tooltip.id = "spellTooltip";
    tooltip.setAttribute("role", "tooltip");
    root.body.appendChild(tooltip);

    const hideTooltip = () => {
      tooltip.classList.remove("is-visible");
    };

    window.addEventListener("resize", hideTooltip);
    window.addEventListener("scroll", hideTooltip, true);
  }

  return tooltip;
}

function positionSpellTooltip(tooltip, anchor) {
  const anchorRect = anchor.getBoundingClientRect();
  const gap = 10;
  const viewportPadding = 12;

  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  let left =
    anchorRect.left +
    anchorRect.width / 2 -
    tooltipWidth / 2;

  left = Math.max(
    viewportPadding,
    Math.min(
      left,
      window.innerWidth - tooltipWidth - viewportPadding
    )
  );

  let top = anchorRect.bottom + gap;

  /* Ha alul nem fér el, kerüljön az ikon fölé. */
  if (
    top + tooltipHeight >
    window.innerHeight - viewportPadding
  ) {
    top = anchorRect.top - tooltipHeight - gap;
  }

  top = Math.max(
    viewportPadding,
    Math.min(
      top,
      window.innerHeight - tooltipHeight - viewportPadding
    )
  );

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function bindSpellTooltip(root, anchor, text) {
  const tooltip = getSpellTooltip(root);

  const showTooltip = () => {
    if (!text) return;

    tooltip.textContent = text;
    tooltip.classList.add("is-visible");

    positionSpellTooltip(tooltip, anchor);
  };

  const hideTooltip = () => {
    tooltip.classList.remove("is-visible");
  };

  anchor.addEventListener("mouseenter", showTooltip);
  anchor.addEventListener("mouseleave", hideTooltip);
  anchor.addEventListener("focus", showTooltip);
  anchor.addEventListener("blur", hideTooltip);

  anchor.setAttribute("aria-describedby", tooltip.id);
}

  blocks.appendChild(card);
}
    });
    renderParagraphs(this.root.getElementById("wizardKnowledge"), knowledge.wizardKnowledge || []);
    const education = this.root.getElementById("educationData");
    education.innerHTML = "";
    (knowledge.education || []).forEach((item) => appendKeyValue(education, item.label, item.value));
  }

  renderAdditional(items) {
    const container = this.root.getElementById("additionalItems");
    container.innerHTML = "";
    items.forEach((item) => {
      const card = createElement("div", "profile-list__item");
      if (typeof item === "string") card.textContent = item;
      else {
        if (item.title) card.appendChild(createElement("strong", "", item.title));
        card.appendChild(document.createTextNode(item.text || ""));
      }
      container.appendChild(card);
    });
  }

  renderSources(items) {
    const container = this.root.getElementById("sourceList");
    container.innerHTML = "";
    items.forEach((item) => {
      const listItem = createElement("li", "profile-source");
      const link = createElement("a", "", item.label || item.url);
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (item.note) link.appendChild(createElement("small", "", item.note));
      listItem.appendChild(link);
      container.appendChild(listItem);
    });
  }
}
