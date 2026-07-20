function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function nodeParagraphs(node) {
  if (Array.isArray(node.paragraphs)) return node.paragraphs;
  if (Array.isArray(node.text)) return node.text;
  if (typeof node.text === "string") {
    return node.text.split(/\n\s*\n/).filter(Boolean);
  }
  return [];
}

function dispatchStoryEvent(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function normalizePresentationEffect(effect) {
  return String(effect || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
}

export class StoryUI {
  constructor({ engine, state, rules, transitions, root = document }) {
    this.engine = engine;
    this.state = state;
    this.rules = rules;
    this.transitions = transitions;
    this.root = root;
    this.timers = new Set();

    /*
     * Megakadályozza, hogy ugyanazon node időzített újrarenderelése
     * ismételten elindítsa a sérülés-, halál- vagy chapter-effektet.
     */
    this.lastPresentedNodeId = null;

    this.elements = {
      title: root.getElementById("storyTitle"),
      progress: root.getElementById("storyProgress"),
      media: root.getElementById("storyMedia"),
      image: root.getElementById("storyImage"),
      sceneTitle: root.getElementById("storySceneTitle"),
      text: root.getElementById("storyText"),
      choices: root.getElementById("storyChoices"),
      status: root.getElementById("storyStatus"),
      route: root.getElementById("storyRoute"),
      endings: root.getElementById("storyEndings"),
      back: root.getElementById("storyBackBtn"),
      restart: root.getElementById("storyRestartBtn")
    };
  }

  init() {
    this.elements.title.textContent = this.engine.meta.title || "Történet";
    this.elements.back.addEventListener("click", () => this.goBack());
    this.elements.restart.addEventListener("click", () => this.restart());
    this.renderCurrent();
  }

  clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }

  renderCurrent() {
    this.clearTimers();

    const nodeId = this.state.run.current;
    const node = this.engine.getNode(nodeId);

    if (!node) {
      return this.showError("A jelenlegi történetcsomópont nem található.");
    }

    this.renderMedia(node.media);
    this.renderText(node);
    this.updateProgress();

    this.elements.back.disabled =
      this.state.run.history.length === 0;

    if (node.type === "ending") {
      this.renderEnding(node);
    } else {
      this.renderChoices(node);
    }

    this.state.saveRun();

    /*
     * Csak valódi node-váltáskor indul el. A timed choice miatt
     * történő, azonos node-on belüli renderCurrent() nem ismétli meg.
     */
    this.emitPresentationForNode(node, nodeId);
  }

  renderMedia(media) {
    if (!media?.src) {
      this.elements.media.hidden = true;
      this.elements.image.removeAttribute("src");
      this.elements.image.alt = "";
      return;
    }

    this.elements.media.hidden = false;
    this.elements.image.src = media.src;
    this.elements.image.alt = media.alt || "";
    this.elements.image.style.objectPosition =
      media.position || "center";

    this.elements.image.onerror = () => {
      this.elements.media.hidden = true;
      this.elements.image.removeAttribute("src");
    };
  }

  renderText(node) {
    this.elements.sceneTitle.textContent = node.title || "";
    this.elements.text.innerHTML = "";

    nodeParagraphs(node).forEach((paragraph) => {
      this.elements.text.appendChild(
        createElement("p", "", paragraph)
      );
    });

    this.elements.choices.innerHTML = "";
    this.elements.status.textContent = "";
    this.elements.route.hidden = true;
    this.elements.route.innerHTML = "";
    this.elements.endings.hidden = true;
    this.elements.endings.innerHTML = "";
  }

  renderChoices(node) {
    let visibleCount = 0;

    node.choices.forEach((choice) => {
      const unlocked = this.rules.evaluate(
        choice.unlock,
        this.state.run.current
      );

      if (!unlocked) {
        this.scheduleUnlock(choice, this.state.run.current);
        return;
      }

      visibleCount += 1;
      this.elements.choices.appendChild(
        this.createChoice(choice, node)
      );
    });

    if (visibleCount === 0) {
      this.elements.status.textContent =
        "A csend még nem adott választ.";
    }
  }

  createChoice(choice, node) {
    const tags = Array.isArray(choice.tags) ? choice.tags : [];
    const button = createElement("button", "story-choice");
    button.type = "button";

    if (tags.includes("critical")) {
      button.classList.add("story-choice--critical");
    }

    if (tags.includes("secret")) {
      button.classList.add("story-choice--secret");
    }

    if (tags.includes("special")) {
      button.classList.add("story-choice--special");
    }

    button.appendChild(
      createElement("span", "story-choice__label", choice.text)
    );

    const marks = [];

    if (tags.includes("critical")) {
      marks.push("kritikus választás");
    }

    if (tags.includes("secret")) {
      marks.push("rejtett lehetőség");
    }

    if (tags.includes("special")) {
      marks.push("különleges");
    }

    if (marks.length) {
      button.appendChild(
        createElement(
          "span",
          "story-choice__mark",
          marks.join(" · ")
        )
      );
    }

    button.addEventListener(
      "click",
      () => this.choose(choice, node)
    );

    return button;
  }

  scheduleUnlock(choice, nodeId) {
    const delay = this.rules.pendingDelay(
      choice.unlock,
      nodeId
    );

    if (delay === null || delay <= 0) return;

    const timer = window.setTimeout(() => {
      this.timers.delete(timer);

      if (this.state.run.current !== nodeId) return;
      if (!this.rules.evaluate(choice.unlock, nodeId)) return;

      this.renderCurrent();
      this.elements.status.textContent =
        "Valami megváltozott a csendben.";

      this.transitions.pulse(
        choice.effect || "glitch"
      );
    }, delay + 20);

    this.timers.add(timer);
  }

  async choose(choice, node) {
    if (this.transitions.busy) return;

    this.clearTimers();
    this.setChoicesDisabled(true);

    const prompt = nodeParagraphs(node).join(" ");

    this.state.takeChoice(
      this.state.run.current,
      choice,
      prompt
    );

    const tags = Array.isArray(choice.tags)
      ? choice.tags
      : [];

    const normalizedEffect =
      choice.effect ||
      (
        tags.includes("secret")
          ? "glitch"
          : tags.includes("critical")
            ? "critical"
            : "normal"
      );

    await this.transitions.swap(
      normalizedEffect,
      () => this.renderCurrent()
    );

    this.setChoicesDisabled(false);
  }

  renderEnding(node) {
    const isNew = this.state.recordEnding(node.endingId);

    this.updateProgress();

    this.elements.status.textContent = isNew
      ? "Új befejezést fedeztél fel."
      : "Ezt a befejezést már korábban megtaláltad.";

    this.renderRoute(node);
    this.renderEndingGallery();

    /*
     * A gallery ekkor már létezik, ezért a StoryEffects meg tudja
     * találni és animálni a megfelelő ending-chipet.
     */
    if (isNew) {
      dispatchStoryEvent("story:endingUnlocked", {
        id: node.endingId,
        title: node.title || ""
      });
    }
  }

  renderRoute(node) {
    const container = this.elements.route;
    container.hidden = false;

    container.appendChild(
      createElement(
        "div",
        "story-engine__route-title",
        "A mostani útvonal"
      )
    );

    const list = createElement(
      "ol",
      "story-engine__route-list"
    );

    this.state.run.steps.forEach((step, index) => {
      const item = createElement(
        "li",
        "story-engine__route-item"
      );

      item.append(
        createElement(
          "span",
          "story-engine__route-index",
          String(index + 1)
        ),
        createElement("span", "", step.chosen)
      );

      list.appendChild(item);
    });

    const endingItem = createElement(
      "li",
      "story-engine__route-item"
    );

    endingItem.append(
      createElement(
        "span",
        "story-engine__route-index",
        "†"
      ),
      createElement(
        "span",
        "",
        node.title || "Befejezés"
      )
    );

    list.appendChild(endingItem);
    container.appendChild(list);
  }

  renderEndingGallery() {
    const container = this.elements.endings;
    container.hidden = false;

    container.appendChild(
      createElement(
        "div",
        "story-engine__endings-title",
        "Felfedezett befejezések"
      )
    );

    const grid = createElement(
      "div",
      "story-engine__ending-grid"
    );

    this.engine.getEndings().forEach((ending, index) => {
      const found = this.state.meta.seenEndings.includes(
        ending.endingId
      );

      const chip = createElement(
        "div",
        `story-ending-chip${
          found ? " story-ending-chip--found" : ""
        }`
      );

      /*
       * Enélkül a story-effects.js nem tudná biztosan azonosítani,
       * melyik befejezés oldódott fel.
       */
      chip.dataset.endingId = String(ending.endingId);

      chip.appendChild(
        createElement(
          "span",
          "story-ending-chip__number",
          `${index + 1}. befejezés`
        )
      );

      chip.appendChild(
        document.createTextNode(
          found
            ? ending.title
            : "Ismeretlen befejezés"
        )
      );

      grid.appendChild(chip);
    });

    container.appendChild(grid);
  }

  updateProgress() {
    const endings = this.engine.getEndings();
    const total = endings.length;

    const found = this.state.meta.seenEndings.filter(
      (id) => endings.some(
        (ending) => ending.endingId === id
      )
    ).length;

    this.elements.progress.textContent =
      `${found} / ${total} befejezés`;
  }

  setChoicesDisabled(disabled) {
    this.elements.choices
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = disabled;
      });

    this.elements.back.disabled =
      disabled ||
      this.state.run.history.length === 0;

    this.elements.restart.disabled = disabled;
  }

  /**
   * A JSON node presentation mezőjét alakítja át böngészős eseményekké.
   *
   * Támogatott forma:
   *
   * "presentation": {
   *   "chapter": {
   *     "roman": "II",
   *     "label": "Fejezet",
   *     "title": "Anya"
   *   },
   *   "effect": "critical-injury",
   *   "timeline": {
   *     "id": "eye-loss",
   *     "date": "2005",
   *     "icon": "◉",
   *     "text": "Elveszítette az egyik szemét."
   *   }
   * }
   */
  emitPresentationForNode(node, nodeId, { force = false } = {}) {
    if (!node) return;

    if (!force && this.lastPresentedNodeId === nodeId) {
      return;
    }

    this.lastPresentedNodeId = nodeId;

    const presentation =
      node.presentation &&
      typeof node.presentation === "object"
        ? node.presentation
        : {};

    const hasChapter =
      presentation.chapter &&
      typeof presentation.chapter === "object";

    dispatchStoryEvent("story:sceneChange", {
      nodeId,
      type: hasChapter ? "chapter" : "scene",
      chapterImage: Boolean(
        presentation.chapterImage ?? hasChapter
      )
    });

    if (hasChapter) {
      dispatchStoryEvent(
        "story:chapterStart",
        presentation.chapter
      );
    }

    const effect = normalizePresentationEffect(
      presentation.effect
    );

    if (
      effect === "critical-injury" ||
      effect === "injury-glitch" ||
      effect === "criticalinjury"
    ) {
      dispatchStoryEvent("story:criticalInjury", {
        nodeId
      });
    } else if (
      effect === "hit" ||
      effect === "injury"
    ) {
      dispatchStoryEvent("story:hit", {
        nodeId
      });
    } else if (
      effect === "death" ||
      effect === "fatal"
    ) {
      dispatchStoryEvent("story:death", {
        nodeId
      });
    }

    const timelineSource = presentation.timeline;

    if (timelineSource) {
      const timelineItems = Array.isArray(timelineSource)
        ? timelineSource
        : [timelineSource];

      dispatchStoryEvent("story:routeUpdate", {
        items: timelineItems
      });
    }
  }

  /**
   * A StoryEffects ezt az első UI-render után meghívhatja,
   * mert a main.js jelenlegi sorrendjében az effektkezelő később indul.
   */
  emitCurrentPresentation({ force = true } = {}) {
    const nodeId = this.state.run.current;
    const node = this.engine.getNode(nodeId);

    if (!node) return;

    this.emitPresentationForNode(
      node,
      nodeId,
      { force }
    );
  }

  async goBack() {
    if (
      this.transitions.busy ||
      !this.state.back()
    ) {
      return;
    }

    this.clearTimers();

    await this.transitions.swap(
      "normal",
      () => this.renderCurrent()
    );
  }

  async restart() {
    if (this.transitions.busy) return;

    this.clearTimers();
    this.state.resetRun();

    /*
     * Így a kezdő node chapter/presentation effektje újra lefuthat.
     */
    this.lastPresentedNodeId = null;

    dispatchStoryEvent("story:restart");

    await this.transitions.swap(
      "normal",
      () => this.renderCurrent()
    );
  }

  showError(message) {
    this.elements.text.innerHTML = "";
    this.elements.text.appendChild(
      createElement(
        "div",
        "story-error",
        message
      )
    );
    this.elements.choices.innerHTML = "";
  }
}
